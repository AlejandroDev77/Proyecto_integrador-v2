package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.DetalleDevolucion;

/**
 * Repository interface for business operations related to DetalleDevolucion
 */
public interface DetalleDevolucionNegocioRepository {
    DetalleDevolucion save(DetalleDevolucion detalle);
    boolean existsByCodigo(String codigo);
}
