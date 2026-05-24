package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.negocio.*;

import java.util.Map;

/**
 * Use case interface for all business process operations.
 * Migrated from old Laravel NegocioController to clean architecture.
 */
public interface NegocioUseCase {

    /** Process a complete sale: create sale, details, update stock, register payment */
    Map<String, Object> procesarVentaCompleta(VentaCompletaRequest request);

    /** Process a complete quotation: create quotation, details, optional cost calculation */
    Map<String, Object> procesarCotizacionCompleta(CotizacionCompletaRequest request);

    /** Convert an existing quotation to a sale */
    Map<String, Object> cotizacionAVenta(Long idCot, CotizacionAVentaRequest request);

    /** Process a product return: create return, details, restore stock */
    Map<String, Object> procesarDevolucion(DevolucionRequest request);

    /** Process a complete material purchase: create purchase, details, update material stock */
    Map<String, Object> procesarCompraCompleta(CompraCompletaRequest request);

    /** Process a complete production order: create order, details, assign stages */
    Map<String, Object> procesarProduccionCompleta(ProduccionCompletaRequest request);

    /** Approve a pending quotation with optional price updates */
    Map<String, Object> aprobarCotizacion(Long idCot, AprobarCotizacionRequest request);

    /** Reject a pending quotation */
    Map<String, Object> rechazarCotizacion(Long idCot, String motivo);

    /** Get summary counts for dashboard */
    Map<String, Object> resumenProcesos();
}
