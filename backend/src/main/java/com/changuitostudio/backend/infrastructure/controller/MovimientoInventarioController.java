package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageMovimientoInventarioUseCase;
import com.changuitostudio.backend.domain.model.MovimientoInventario;
import com.changuitostudio.backend.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/movimientos-inventario")
public class MovimientoInventarioController {

    private final ManageMovimientoInventarioUseCase manageMovimientoInventarioUseCase;

    public MovimientoInventarioController(ManageMovimientoInventarioUseCase manageMovimientoInventarioUseCase) {
        this.manageMovimientoInventarioUseCase = manageMovimientoInventarioUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<MovimientoInventario>>> listar(
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

        PageResult<MovimientoInventario> result = manageMovimientoInventarioUseCase.listar(page, per_page, filters, sort);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovimientoInventario>> obtenerPorId(@PathVariable Long id) {
        return manageMovimientoInventarioUseCase.obtenerPorId(id)
                .map(res -> ResponseEntity.ok(ApiResponse.success(res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("MovimientoInventario no encontrado", HttpStatus.NOT_FOUND.value())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MovimientoInventario>> crear(@RequestBody MovimientoInventario movimientoinventario) {
        MovimientoInventario creado = manageMovimientoInventarioUseCase.crear(movimientoinventario);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovimientoInventario>> actualizar(@PathVariable Long id, @RequestBody MovimientoInventario movimientoinventario) {
        MovimientoInventario actualizado = manageMovimientoInventarioUseCase.actualizar(id, movimientoinventario);
        return ResponseEntity.ok(ApiResponse.success(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        manageMovimientoInventarioUseCase.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
