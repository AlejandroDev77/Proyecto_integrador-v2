package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageCostoCotizacionUseCase;
import com.changuitostudio.backend.domain.model.CostoCotizacion;
import com.changuitostudio.backend.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/costo-cotizaciones")
public class CostoCotizacionController {

    private final ManageCostoCotizacionUseCase manageCostoCotizacionUseCase;

    public CostoCotizacionController(ManageCostoCotizacionUseCase manageCostoCotizacionUseCase) {
        this.manageCostoCotizacionUseCase = manageCostoCotizacionUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<CostoCotizacion>>> listar(
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

        PageResult<CostoCotizacion> result = manageCostoCotizacionUseCase.listar(page, per_page, filters, sort);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CostoCotizacion>> obtenerPorId(@PathVariable Long id) {
        return manageCostoCotizacionUseCase.obtenerPorId(id)
                .map(res -> ResponseEntity.ok(ApiResponse.success(res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("CostoCotizacion no encontrado", HttpStatus.NOT_FOUND.value())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CostoCotizacion>> crear(@RequestBody CostoCotizacion costocotizacion) {
        CostoCotizacion creado = manageCostoCotizacionUseCase.crear(costocotizacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CostoCotizacion>> actualizar(@PathVariable Long id, @RequestBody CostoCotizacion costocotizacion) {
        CostoCotizacion actualizado = manageCostoCotizacionUseCase.actualizar(id, costocotizacion);
        return ResponseEntity.ok(ApiResponse.success(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        manageCostoCotizacionUseCase.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
