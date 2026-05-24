package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageEvidenciaProduccionUseCase;
import com.changuitostudio.backend.domain.model.EvidenciaProduccion;
import com.changuitostudio.backend.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/evidencias-produccion")
public class EvidenciaProduccionController {

    private final ManageEvidenciaProduccionUseCase manageEvidenciaProduccionUseCase;

    public EvidenciaProduccionController(ManageEvidenciaProduccionUseCase manageEvidenciaProduccionUseCase) {
        this.manageEvidenciaProduccionUseCase = manageEvidenciaProduccionUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<EvidenciaProduccion>>> listar(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int per_page,
            @RequestParam(required = false) Map<String, String> filters,
            @RequestParam(defaultValue = "-id") String sort
    ) {
        // Remove standard pagination params and extract filter[key] -> key
        if (filters != null) {
            filters.remove("page");
            filters.remove("per_page");
            filters.remove("sort");
            // Extract filter[key]=value -> key=value
            java.util.Map<String, String> extracted = new java.util.HashMap<>();
            filters.forEach((k, v) -> {
                if (k.startsWith("filter[") && k.endsWith("]")) {
                    extracted.put(k.substring(7, k.length() - 1), v);
                } else {
                    extracted.put(k, v);
                }
            });
            filters = extracted;
        }

        PageResult<EvidenciaProduccion> result = manageEvidenciaProduccionUseCase.listar(page, per_page, filters, sort);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EvidenciaProduccion>> obtenerPorId(@PathVariable Long id) {
        return manageEvidenciaProduccionUseCase.obtenerPorId(id)
                .map(res -> ResponseEntity.ok(ApiResponse.success(res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("EvidenciaProduccion no encontrado", HttpStatus.NOT_FOUND.value())));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<EvidenciaProduccion>> crear(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("id_pro_eta") Long idProEta,
            @RequestParam("tipo_evi") String tipoEvi,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("id_emp") Long idEmp
    ) {
        EvidenciaProduccion creado = manageEvidenciaProduccionUseCase.subirEvidencia(archivo, idProEta, tipoEvi, descripcion, idEmp);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EvidenciaProduccion>> actualizar(@PathVariable Long id, @RequestBody EvidenciaProduccion evidenciaproduccion) {
        EvidenciaProduccion actualizado = manageEvidenciaProduccionUseCase.actualizar(id, evidenciaproduccion);
        return ResponseEntity.ok(ApiResponse.success(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        manageEvidenciaProduccionUseCase.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
