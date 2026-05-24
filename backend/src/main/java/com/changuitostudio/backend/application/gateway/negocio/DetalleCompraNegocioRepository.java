package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.DetalleCompra;

/**
 * Repository interface for business operations related to DetalleCompra
 */
public interface DetalleCompraNegocioRepository {
    DetalleCompra save(DetalleCompra detalle);
    boolean existsByCodigo(String codigo);
}
