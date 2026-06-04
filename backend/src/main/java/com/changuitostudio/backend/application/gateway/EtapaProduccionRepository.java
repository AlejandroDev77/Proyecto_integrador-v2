package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.EtapaProduccion;

import java.util.Map;
import java.util.Optional;

public interface EtapaProduccionRepository {
    PageResult<EtapaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<EtapaProduccion> obtenerPorId(Long id);
    EtapaProduccion guardar(EtapaProduccion etapaproduccion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    Optional<EtapaProduccion> findById(Long id);
}
