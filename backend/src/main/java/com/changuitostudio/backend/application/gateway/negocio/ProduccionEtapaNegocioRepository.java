package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.ProduccionEtapa;

/**
 * Repository interface for business operations related to ProduccionEtapa
 */
public interface ProduccionEtapaNegocioRepository {
    ProduccionEtapa save(ProduccionEtapa etapa);
    boolean existsByCodigo(String codigo);
}
