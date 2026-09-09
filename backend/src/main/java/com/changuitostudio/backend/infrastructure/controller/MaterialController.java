package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageMaterialUseCase;
import com.changuitostudio.backend.domain.model.Material;
import com.changuitostudio.backend.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.changuitostudio.backend.application.gateway.StorageGateway;

import java.util.Map;
@RestController
@RequestMapping("/api/materiales")
public class MaterialController {

    private final ManageMaterialUseCase manageMaterialUseCase;
    private final StorageGateway storageGateway;

    public MaterialController(ManageMaterialUseCase manageMaterialUseCase, StorageGateway storageGateway) {
        this.manageMaterialUseCase = manageMaterialUseCase;
        this.storageGateway = storageGateway;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<Material>>> listar(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int per_page,
            @RequestParam(required = false) Map<String, String> filters,
            @RequestParam(defaultValue = "-id") String sort
    ) {
        // Remove standard pagination params and extract filter[key] -> key
        if (filters == null) filters = new java.util.HashMap<>();
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

        PageResult<Material> result = manageMaterialUseCase.listar(page, per_page, filters, sort);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Material>> obtenerPorId(@PathVariable Long id) {
        return manageMaterialUseCase.obtenerPorId(id)
                .map(res -> ResponseEntity.ok(ApiResponse.success(res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Material no encontrado", HttpStatus.NOT_FOUND.value())));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<Material>> crear(
            @RequestParam("nom_mat") String nomMat,
            @RequestParam("desc_mat") String descMat,
            @RequestParam("stock_mat") Double stockMat,
            @RequestParam("stock_min") Double stockMin,
            @RequestParam("unidad_medida") String unidadMedida,
            @RequestParam("costo_mat") Double costoMat,
            @RequestParam(value = "est_mat", defaultValue = "1") String estMat,
            @RequestParam(value = "img_mat", required = false) MultipartFile imgMat
    ) {
        Material material = new Material();
        material.setNomMat(nomMat);
        material.setDescMat(descMat);
        material.setStockMat(stockMat);
        material.setStockMin(stockMin);
        material.setUnidadMedida(unidadMedida);
        material.setCostoMat(costoMat);
        material.setEstMat("1".equals(estMat));

        if (imgMat != null && !imgMat.isEmpty()) {
            String url = storageGateway.save(imgMat, "materiales");
            material.setImgMat(url);
        }

        Material creado = manageMaterialUseCase.crear(material);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(creado));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<Material>> actualizar(
            @PathVariable Long id,
            @RequestParam("nom_mat") String nomMat,
            @RequestParam("desc_mat") String descMat,
            @RequestParam("stock_mat") Double stockMat,
            @RequestParam("stock_min") Double stockMin,
            @RequestParam("unidad_medida") String unidadMedida,
            @RequestParam("costo_mat") Double costoMat,
            @RequestParam(value = "est_mat", defaultValue = "1") String estMat,
            @RequestParam(value = "img_mat", required = false) MultipartFile imgMat
    ) {
        Material material = new Material();
        material.setNomMat(nomMat);
        material.setDescMat(descMat);
        material.setStockMat(stockMat);
        material.setStockMin(stockMin);
        material.setUnidadMedida(unidadMedida);
        material.setCostoMat(costoMat);
        material.setEstMat("1".equals(estMat));

        if (imgMat != null && !imgMat.isEmpty()) {
            String url = storageGateway.save(imgMat, "materiales");
            material.setImgMat(url);
        }

        Material actualizado = manageMaterialUseCase.actualizar(id, material);
        return ResponseEntity.ok(ApiResponse.success(actualizado));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<Void>> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Boolean estado = body.get("est_mat");
        if (estado == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Estado (est_mat) es requerido", HttpStatus.BAD_REQUEST.value()));
        }
        manageMaterialUseCase.cambiarEstado(id, estado);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        manageMaterialUseCase.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
