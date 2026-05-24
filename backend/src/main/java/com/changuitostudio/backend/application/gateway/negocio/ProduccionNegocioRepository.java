package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.Produccion;

/**
 * Repository interface for business operations related to Produccion
 */
public interface ProduccionNegocioRepository {
    Produccion save(Produccion produccion);
    boolean existsByCodigo(String codigo);
}
