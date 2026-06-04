package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageProveedorUseCase;
import com.changuitostudio.backend.domain.model.Proveedor;
import com.changuitostudio.backend.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    private final ManageProveedorUseCase manageProveedorUseCase;

    public ProveedorController(ManageProveedorUseCase manageProveedorUseCase) {
        this.manageProveedorUseCase = manageProveedorUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<Proveedor>>> listar(
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

        PageResult<Proveedor> result = manageProveedorUseCase.listar(page, per_page, filters, sort);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Proveedor>> obtenerPorId(@PathVariable Long id) {
        return manageProveedorUseCase.obtenerPorId(id)
                .map(res -> ResponseEntity.ok(ApiResponse.success(res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Proveedor no encontrado", HttpStatus.NOT_FOUND.value())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Proveedor>> crear(@RequestBody Proveedor proveedor) {
        Proveedor creado = manageProveedorUseCase.crear(proveedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Proveedor>> actualizar(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        Proveedor actualizado = manageProveedorUseCase.actualizar(id, proveedor);
        return ResponseEntity.ok(ApiResponse.success(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        manageProveedorUseCase.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
