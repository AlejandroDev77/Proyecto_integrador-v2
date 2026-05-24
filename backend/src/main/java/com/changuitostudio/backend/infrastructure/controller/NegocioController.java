package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.negocio.*;
import com.changuitostudio.backend.application.usecase.NegocioUseCase;
import com.changuitostudio.backend.shared.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for business process operations.
 * Handles complex business workflows like sales, quotations, returns, purchases, and production.
 */
@RestController
@RequestMapping("/api/negocio")
@CrossOrigin(origins = "*")
public class NegocioController {

    private final NegocioUseCase negocioUseCase;

    public NegocioController(NegocioUseCase negocioUseCase) {
        this.negocioUseCase = negocioUseCase;
    }

    /**
     * Process a complete sale: create sale, details, update stock, register payment
     * POST /api/negocio/venta-completa
     */
    @PostMapping("/venta-completa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> procesarVentaCompleta(
            @Valid @RequestBody VentaCompletaRequest request) {
        Map<String, Object> result = negocioUseCase.procesarVentaCompleta(request);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success((String) result.get("message"), (Map<String, Object>) result.get("data")));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Process a complete quotation: create quotation, details, optional cost calculation
     * POST /api/negocio/cotizacion-completa
     */
    @PostMapping("/cotizacion-completa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> procesarCotizacionCompleta(
            @Valid @RequestBody CotizacionCompletaRequest request) {
        Map<String, Object> result = negocioUseCase.procesarCotizacionCompleta(request);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success((String) result.get("message"), (Map<String, Object>) result.get("data")));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Convert an existing quotation to a sale
     * POST /api/negocio/cotizacion-a-venta/{id}
     */
    @PostMapping("/cotizacion-a-venta/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cotizacionAVenta(
            @PathVariable("id") Long idCot,
            @Valid @RequestBody CotizacionAVentaRequest request) {
        Map<String, Object> result = negocioUseCase.cotizacionAVenta(idCot, request);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success((String) result.get("message"), (Map<String, Object>) result.get("data")));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Process a product return: create return, details, restore stock
     * POST /api/negocio/devolucion-completa
     */
    @PostMapping("/devolucion-completa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> procesarDevolucion(
            @Valid @RequestBody DevolucionRequest request) {
        Map<String, Object> result = negocioUseCase.procesarDevolucion(request);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success((String) result.get("message"), (Map<String, Object>) result.get("data")));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Process a complete material purchase: create purchase, details, update material stock
     * POST /api/negocio/compra-completa
     */
    @PostMapping("/compra-completa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> procesarCompraCompleta(
            @Valid @RequestBody CompraCompletaRequest request) {
        Map<String, Object> result = negocioUseCase.procesarCompraCompleta(request);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success((String) result.get("message"), (Map<String, Object>) result.get("data")));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Process a complete production order: create order, details, assign stages
     * POST /api/negocio/produccion-completa
     */
    @PostMapping("/produccion-completa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> procesarProduccionCompleta(
            @Valid @RequestBody ProduccionCompletaRequest request) {
        Map<String, Object> result = negocioUseCase.procesarProduccionCompleta(request);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success((String) result.get("message"), (Map<String, Object>) result.get("data")));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Approve a pending quotation with optional price updates
     * POST /api/negocio/cotizacion/{id}/aprobar
     */
    @PostMapping("/cotizacion/{id}/aprobar")
    public ResponseEntity<ApiResponse<Map<String, Object>>> aprobarCotizacion(
            @PathVariable("id") Long idCot,
            @Valid @RequestBody AprobarCotizacionRequest request) {
        Map<String, Object> result = negocioUseCase.aprobarCotizacion(idCot, request);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.ok(ApiResponse.success((String) result.get("message"), (Map<String, Object>) Map.of("cotizacion", result.get("cotizacion"))));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Reject a pending quotation
     * POST /api/negocio/cotizacion/{id}/rechazar
     */
    @PostMapping("/cotizacion/{id}/rechazar")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rechazarCotizacion(
            @PathVariable("id") Long idCot,
            @RequestBody(required = false) Map<String, String> body) {
        String motivo = body != null ? body.get("motivo") : null;
        Map<String, Object> result = negocioUseCase.rechazarCotizacion(idCot, motivo);
        
        if (Boolean.TRUE.equals(result.get("success"))) {
            return ResponseEntity.ok(ApiResponse.success((String) result.get("message"), (Map<String, Object>) Map.of("cotizacion", result.get("cotizacion"))));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error((String) result.get("message")));
        }
    }

    /**
     * Get summary counts for dashboard
     * GET /api/negocio/resumen
     */
    @GetMapping("/resumen")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resumenProcesos() {
        Map<String, Object> resumen = negocioUseCase.resumenProcesos();
        return ResponseEntity.ok(ApiResponse.success("Resumen obtenido correctamente", resumen));
    }
}
