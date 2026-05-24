package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Produccion;

import java.util.Map;
import java.util.Optional;

public interface ProduccionRepository {
    PageResult<Produccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Produccion> obtenerPorId(Long id);
    Produccion guardar(Produccion produccion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    Produccion save(Produccion produccion);
}
