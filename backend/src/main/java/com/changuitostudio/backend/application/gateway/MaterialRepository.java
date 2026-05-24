package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Material;

import java.util.Map;
import java.util.Optional;

public interface MaterialRepository {
    PageResult<Material> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Material> obtenerPorId(Long id);
    Material guardar(Material material);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    Optional<Material> findById(Long id);
    Material save(Material material);
}
