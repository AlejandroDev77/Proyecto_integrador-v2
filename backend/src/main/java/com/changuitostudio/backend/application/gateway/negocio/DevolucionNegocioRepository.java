package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.Devolucion;

/**
 * Repository interface for business operations related to Devolucion
 */
public interface DevolucionNegocioRepository {
    Devolucion save(Devolucion devolucion);
    boolean existsByCodigo(String codigo);
    long countByFecDevMonth(int month, int year);
}
