package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.GeneracionIARepository;
import com.changuitostudio.backend.application.usecase.ManageGeneracionIAUseCase;
import com.changuitostudio.backend.domain.model.GeneracionIA;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class GeneracionIAService implements ManageGeneracionIAUseCase {

    private final GeneracionIARepository generacionIARepository;
    private final RestTemplate restTemplate;

    @Value("${app.ai-service.url}")
    private String aiServiceUrl;

    public GeneracionIAService(GeneracionIARepository generacionIARepository, RestTemplate restTemplate) {
        this.generacionIARepository = generacionIARepository;
        this.restTemplate = restTemplate;
    }

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
        
        // Llamar a FastAPI de forma asíncrona
        llamarServicioIA(guardado);
        
        return guardado;
    }

    private void llamarServicioIA(GeneracionIA gen) {
        CompletableFuture.runAsync(() -> {
            try {
                Map<String, Object> request = new HashMap<>();
                request.put("id_mueble", gen.getId());
                request.put("imagenes", gen.getImagenesReferencia());

                restTemplate.postForEntity(aiServiceUrl + "/generate-3d", request, String.class);
                System.out.println("Solicitud de generación 3D enviada para ID: " + gen.getId());
            } catch (Exception e) {
                System.err.println("Error al llamar al servicio de IA: " + e.getMessage());
                // Podríamos actualizar el estado a "error" aquí si quisiéramos
                gen.setEstado("error");
                generacionIARepository.guardar(gen);
            }
        });
    }

    @Override
    public GeneracionIA actualizar(Long id, GeneracionIA generacionIA) {
        GeneracionIA existente = generacionIARepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Generación IA no encontrada"));

        if (generacionIA.getNombreMueble() != null) existente.setNombreMueble(generacionIA.getNombreMueble());
        if (generacionIA.getEstado() != null) existente.setEstado(generacionIA.getEstado());
        if (generacionIA.getModelo3dUrl() != null) existente.setModelo3dUrl(generacionIA.getModelo3dUrl());
        if (generacionIA.getIdMueble() != null) existente.setIdMueble(generacionIA.getIdMueble());
        if (generacionIA.getImagenesReferencia() != null) existente.setImagenesReferencia(generacionIA.getImagenesReferencia());

        return generacionIARepository.guardar(existente);
    }

    @Override
    public void eliminar(Long id) {
        generacionIARepository.eliminarPorId(id);
    }
}
