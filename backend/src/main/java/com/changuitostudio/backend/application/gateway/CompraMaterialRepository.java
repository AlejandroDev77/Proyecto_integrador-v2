package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.CompraMaterial;

import java.util.Map;
import java.util.Optional;

public interface CompraMaterialRepository {
    PageResult<CompraMaterial> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<CompraMaterial> obtenerPorId(Long id);
    CompraMaterial guardar(CompraMaterial compramaterial);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    long countByFecCompMonth(int month, int year);
    CompraMaterial save(CompraMaterial compraMaterial);
}
