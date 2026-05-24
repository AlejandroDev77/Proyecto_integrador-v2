package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.DetalleCotizacion;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for business operations related to DetalleCotizacion
 */
public interface DetalleCotizacionNegocioRepository {
    DetalleCotizacion save(DetalleCotizacion detalle);
    boolean existsByCodigo(String codigo);
    List<DetalleCotizacion> findByCotizacionId(Long idCot);
    Optional<DetalleCotizacion> findById(Long id);
}
