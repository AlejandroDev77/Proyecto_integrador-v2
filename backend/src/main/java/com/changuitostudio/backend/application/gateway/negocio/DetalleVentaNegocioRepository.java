package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.DetalleVenta;

/**
 * Repository interface for business operations related to DetalleVenta
 */
public interface DetalleVentaNegocioRepository {
    DetalleVenta save(DetalleVenta detalle);
    boolean existsByCodigo(String codigo);
}
