package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.GeneracionIARepository;
import com.changuitostudio.backend.application.usecase.ManageGeneracionIAUseCase;
import com.changuitostudio.backend.domain.model.GeneracionIA;
import com.changuitostudio.backend.infrastructure.storage.CloudflareR2Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Servicio de Generación IA — integración con Tripo3D API v3.
 *
 * Flujo asíncrono al crear una generación:
 *   1. Usa las URLs de imágenes de referencia (ya en R2) directamente como input de Tripo
 *   2. Crea tarea en POST /v3/generation/image-to-model (o multiview-to-model)
 *   3. Polling en GET /v3/tasks/{task_id} hasta status=success
 *   4. Descarga el GLB desde output.model_url
 *   5. Sube el GLB a Cloudflare R2
 *   6. Actualiza el registro en BD: estado="completado", modelo_3d_url=<URL de R2>
 *
 * Referencia: https://openapi.tripo3d.ai/v3
 */
@Service
public class GeneracionIAService implements ManageGeneracionIAUseCase {

    private final GeneracionIARepository generacionIARepository;
    private final CloudflareR2Service r2Service;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${app.tripo3d.api-key}")
    private String tripoApiKey;

    @Value("${app.tripo3d.base-url}")
    private String tripoBaseUrl;

    public GeneracionIAService(GeneracionIARepository generacionIARepository,
                               CloudflareR2Service r2Service) {
        this.generacionIARepository = generacionIARepository;
        this.r2Service = r2Service;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
    }

    // ─── CRUD ────────────────────────────────────────────────────────────────

    @Override
    public PageResult<GeneracionIA> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return generacionIARepository.buscarTodos(page, perPage, filters, sort);
    }

    @Override
    public Optional<GeneracionIA> obtenerPorId(Long id) {
        return generacionIARepository.buscarPorId(id);
    }

    @Override
    public GeneracionIA crear(GeneracionIA generacionIA) {
        if (generacionIA.getEstado() == null) {
            generacionIA.setEstado("procesando");
        }
        GeneracionIA guardado = generacionIARepository.guardar(generacionIA);

        // Lanzar proceso de generación 3D de forma asíncrona
        CompletableFuture.runAsync(() -> generarModelo3D(guardado));

        return guardado;
    }

    @Override
    public GeneracionIA actualizar(Long id, GeneracionIA generacionIA) {
        GeneracionIA existente = generacionIARepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Generación IA no encontrada con id: " + id));

        if (generacionIA.getNombreMueble() != null)       existente.setNombreMueble(generacionIA.getNombreMueble());
        if (generacionIA.getEstado() != null)             existente.setEstado(generacionIA.getEstado());
        if (generacionIA.getModelo3dUrl() != null)        existente.setModelo3dUrl(generacionIA.getModelo3dUrl());
        if (generacionIA.getIdMueble() != null)           existente.setIdMueble(generacionIA.getIdMueble());
        if (generacionIA.getImagenesReferencia() != null) existente.setImagenesReferencia(generacionIA.getImagenesReferencia());

        return generacionIARepository.guardar(existente);
    }

    @Override
    public void eliminar(Long id) {
        generacionIARepository.eliminarPorId(id);
    }

    // ─── Flujo Tripo3D v3 ────────────────────────────────────────────────────

    /**
     * Flujo completo: Tripo3D v3 → descarga GLB → sube a R2 → actualiza BD.
     */
    private void generarModelo3D(GeneracionIA gen) {
        try {
            List<String> imagenes = gen.getImagenesReferencia();
            if (imagenes == null || imagenes.isEmpty()) {
                marcarError(gen, "No hay imágenes de referencia.");
                return;
            }

            System.out.println("[Tripo3D v3] Iniciando generación para ID: " + gen.getId());

            // 1. Crear tarea en Tripo3D v3 — las URLs de R2 se pasan directamente como input
            String taskId = crearTarea(imagenes);
            System.out.println("[Tripo3D v3] Tarea creada: " + taskId);

            // 2. Polling hasta que la tarea complete
            String modelUrl = esperarResultado(taskId);
            System.out.println("[Tripo3D v3] GLB disponible en: " + modelUrl);

            // 3. Descargar el GLB (la URL expira en ~5 min según docs)
            byte[] glbBytes = descargarArchivo(modelUrl);
            System.out.println("[Tripo3D v3] GLB descargado: " + glbBytes.length + " bytes");

            // 4. Subir el GLB a Cloudflare R2
            String nombreArchivo = "gen-" + gen.getId() + "-" + UUID.randomUUID() + ".glb";
            String r2Url = r2Service.uploadBytes(glbBytes, "modelos-3d", nombreArchivo, "model/gltf-binary");
            System.out.println("[R2] GLB subido: " + r2Url);

            // 5. Actualizar registro en BD
            gen.setModelo3dUrl(r2Url);
            gen.setEstado("completado");
            generacionIARepository.guardar(gen);
            System.out.println("[BD] Generación ID " + gen.getId() + " completada.");

        } catch (Exception e) {
            System.err.println("[Tripo3D v3] Error en generación ID " + gen.getId() + ": " + e.getMessage());
            e.printStackTrace();
            marcarError(gen, e.getMessage());
        }
    }

    /**
     * Crea una tarea de generación en Tripo3D API v3.
     *
     * - 1 imagen  → POST /v3/generation/image-to-model  con { input: <url> }
     * - 2+ imgs   → POST /v3/generation/multiview-to-model con { files: [...] }
     *
     * Las URLs de las imágenes se pasan directamente — no hay que subirlas a Tripo.
     *
     * @return task_id retornado por Tripo3D
     */
    private String crearTarea(List<String> imagenesUrl) {
        try {
            String endpoint;
            String bodyJson;

            if (imagenesUrl.size() == 1) {
                // ── image-to-model (H Series) ──────────────────────────────
                endpoint = tripoBaseUrl + "/generation/image-to-model";
                bodyJson = objectMapper.writeValueAsString(Map.of(
                        "input",           imagenesUrl.get(0),   // URL directa de R2
                        "model",           "v3.1-20260211",       // Última versión
                        "texture",         true,
                        "pbr",             true,
                        "texture_quality", "standard",
                        "face_limit",      20000,                // Limitar polígonos para web (~2MB a 5MB)
                        "texture_size",    1024                  // Limitar texturas a 1K
                ));
            } else {
                // ── multiview-to-model ────────────────────────────────────
                endpoint = tripoBaseUrl + "/generation/multiview-to-model";

                // Las primeras 4 imágenes como vistas (front, left, right, back)
                List<String> vistas = imagenesUrl.stream().limit(4).toList();
                bodyJson = objectMapper.writeValueAsString(Map.of(
                        "files",        vistas,               // Array de URLs directas
                        "model",        "v3.1-20260211",
                        "texture",      true,
                        "pbr",          true,
                        "face_limit",   20000,                // Optimizado para web
                        "texture_size", 1024                  // Texturas en 1K
                ));
            }

            System.out.println("[Tripo3D v3] POST " + endpoint);
            System.out.println("[Tripo3D v3] Body: " + bodyJson);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Authorization", "Bearer " + tripoApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("[Tripo3D v3] Respuesta crear tarea (" + response.statusCode() + "): " + response.body());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Error HTTP " + response.statusCode() + ": " + response.body());
            }

            JsonNode json = objectMapper.readTree(response.body());
            if (json.path("code").asInt() != 0) {
                throw new RuntimeException("Error de Tripo3D: " + response.body());
            }

            return json.path("data").path("task_id").asText();

        } catch (Exception e) {
            throw new RuntimeException("Error creando tarea en Tripo3D v3: " + e.getMessage(), e);
        }
    }

    /**
     * Polling del estado de la tarea usando GET /v3/tasks/{task_id}.
     * Espera hasta status=success. Máximo 10 minutos.
     *
     * Respuesta exitosa (v3):
     * {
     *   "data": {
     *     "status": "success",
     *     "output": {
     *       "model_url": "https://...",
     *       "rendered_image_url": "https://..."
     *     }
     *   }
     * }
     *
     * @return URL del modelo GLB (output.model_url)
     */
    private String esperarResultado(String taskId) throws InterruptedException {
        int maxIntentos = 120; // 120 × 5s = 10 minutos
        int intento = 0;

        while (intento < maxIntentos) {
            Thread.sleep(5000);
            intento++;

            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(tripoBaseUrl + "/tasks/" + taskId))
                        .header("Authorization", "Bearer " + tripoApiKey)
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                JsonNode json = objectMapper.readTree(response.body());
                JsonNode data = json.path("data");

                String status   = data.path("status").asText();
                int    progress = data.path("progress").asInt();

                System.out.println("[Tripo3D v3] Tarea " + taskId + " → " + status + " (" + progress + "%)");

                switch (status) {
                    case "success" -> {
                        // v3: la URL está en data.output.model_url
                        JsonNode output = data.path("output");
                        System.out.println("[Tripo3D v3] Output completo: " + output.toPrettyString());

                        String modelUrl = output.path("model_url").asText(null);
                        if (modelUrl == null || modelUrl.isBlank()) {
                            throw new RuntimeException(
                                "Tarea exitosa pero sin model_url. Output: " + output.toPrettyString());
                        }
                        return modelUrl;
                    }
                    case "failed", "cancelled" ->
                        throw new RuntimeException("Tarea terminó con estado: " + status
                            + " — " + data.path("message").asText("sin mensaje"));
                    // "queued", "running" → continuar polling
                }

            } catch (InterruptedException e) {
                throw e;
            } catch (Exception e) {
                System.err.println("[Tripo3D v3] Error en polling intento " + intento + ": " + e.getMessage());
            }
        }

        throw new RuntimeException("Tiempo de espera agotado para tarea: " + taskId);
    }

    /**
     * Descarga los bytes de un archivo desde una URL pública.
     * Las URLs de Tripo3D expiran en ~5 minutos — se descarga inmediatamente.
     */
    private byte[] descargarArchivo(String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .timeout(Duration.ofSeconds(120))
                .build();

        HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Error descargando archivo (HTTP " + response.statusCode() + "): " + url);
        }

        return response.body().readAllBytes();
    }

    /**
     * Actualiza el registro en la BD con estado "error".
     */
    private void marcarError(GeneracionIA gen, String motivo) {
        try {
            gen.setEstado("error");
            generacionIARepository.guardar(gen);
            System.err.println("[BD] Generación ID " + gen.getId() + " marcada como error: " + motivo);
        } catch (Exception e) {
            System.err.println("[BD] No se pudo marcar error: " + e.getMessage());
        }
    }
}
