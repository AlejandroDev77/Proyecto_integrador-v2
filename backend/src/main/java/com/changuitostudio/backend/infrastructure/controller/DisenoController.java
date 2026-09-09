package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageDisenoUseCase;
import com.changuitostudio.backend.domain.model.Diseno;
import com.changuitostudio.backend.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import com.changuitostudio.backend.application.gateway.StorageGateway;
import com.changuitostudio.backend.domain.model.Cotizacion;

import java.util.Map;

@RestController
@RequestMapping("/api/disenos")
public class DisenoController {

    private final ManageDisenoUseCase manageDisenoUseCase;
    private final StorageGateway storageGateway;

    public DisenoController(ManageDisenoUseCase manageDisenoUseCase, StorageGateway storageGateway) {
        this.manageDisenoUseCase = manageDisenoUseCase;
        this.storageGateway = storageGateway;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<Diseno>>> listar(
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

        PageResult<Diseno> result = manageDisenoUseCase.listar(page, per_page, filters, sort);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Diseno>> obtenerPorId(@PathVariable Long id) {
        return manageDisenoUseCase.obtenerPorId(id)
                .map(res -> ResponseEntity.ok(ApiResponse.success(res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Diseno no encontrado", HttpStatus.NOT_FOUND.value())));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<Diseno>> crear(
            @RequestParam("nom_dis") String nomDis,
            @RequestParam("desc_dis") String descDis,
            @RequestParam("id_cot") Long idCot,
            @RequestParam(value = "img_dis", required = false) MultipartFile imgDis,
            @RequestParam(value = "archivo_3d", required = false) MultipartFile archivo3d
    ) {
        Diseno diseno = new Diseno();
        diseno.setNomDis(nomDis);
        diseno.setDescDis(descDis);
        
        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setId(idCot);
        diseno.setCotizacion(cotizacion);

        if (imgDis != null && !imgDis.isEmpty()) {
            diseno.setImgDis(storageGateway.save(imgDis, "images"));
        }
        if (archivo3d != null && !archivo3d.isEmpty()) {
            diseno.setArchivo3d(storageGateway.save(archivo3d, "models"));
        }

        Diseno creado = manageDisenoUseCase.crear(diseno);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(creado));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<Diseno>> actualizar(
            @PathVariable Long id,
            @RequestParam("nom_dis") String nomDis,
            @RequestParam("desc_dis") String descDis,
            @RequestParam("id_cot") Long idCot,
            @RequestParam(value = "img_dis", required = false) MultipartFile imgDis,
            @RequestParam(value = "archivo_3d", required = false) MultipartFile archivo3d
    ) {
        Diseno diseno = new Diseno();
        diseno.setNomDis(nomDis);
        diseno.setDescDis(descDis);
        
        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setId(idCot);
        diseno.setCotizacion(cotizacion);

        if (imgDis != null && !imgDis.isEmpty()) {
            diseno.setImgDis(storageGateway.save(imgDis, "images"));
        }
        if (archivo3d != null && !archivo3d.isEmpty()) {
            diseno.setArchivo3d(storageGateway.save(archivo3d, "models"));
        }

        Diseno actualizado = manageDisenoUseCase.actualizar(id, diseno);
        return ResponseEntity.ok(ApiResponse.success(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        manageDisenoUseCase.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
