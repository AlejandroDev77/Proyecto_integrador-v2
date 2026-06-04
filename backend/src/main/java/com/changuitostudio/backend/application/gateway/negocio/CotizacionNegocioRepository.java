package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.Cotizacion;

import java.util.Optional;

/**
 * Repository interface for business operations related to Cotizacion
 */
public interface CotizacionNegocioRepository {
    Optional<Cotizacion> findById(Long id);
    Cotizacion save(Cotizacion cotizacion);
    boolean existsByCodigo(String codigo);
    long countByEstCot(String estado);
}
