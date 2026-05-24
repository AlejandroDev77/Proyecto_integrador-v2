package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.ProduccionEtapa;

import java.util.Map;
import java.util.Optional;

public interface ProduccionEtapaRepository {
    PageResult<ProduccionEtapa> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<ProduccionEtapa> obtenerPorId(Long id);
    ProduccionEtapa guardar(ProduccionEtapa produccionetapa);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    ProduccionEtapa save(ProduccionEtapa produccionEtapa);
}
