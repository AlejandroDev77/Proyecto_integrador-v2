package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.DetalleProduccion;

/**
 * Repository interface for business operations related to DetalleProduccion
 */
public interface DetalleProduccionNegocioRepository {
    DetalleProduccion save(DetalleProduccion detalle);
    boolean existsByCodigo(String codigo);
}
