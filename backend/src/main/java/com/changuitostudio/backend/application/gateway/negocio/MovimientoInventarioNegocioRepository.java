package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.MovimientoInventario;

/**
 * Repository interface for business operations related to MovimientoInventario
 */
public interface MovimientoInventarioNegocioRepository {
    MovimientoInventario save(MovimientoInventario movimiento);
    boolean existsByCodigo(String codigo);
}
