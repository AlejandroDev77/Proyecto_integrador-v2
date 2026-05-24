package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Proveedor;

import java.util.Map;
import java.util.Optional;

public interface ProveedorRepository {
    PageResult<Proveedor> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Proveedor> obtenerPorId(Long id);
    Proveedor guardar(Proveedor proveedor);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    Optional<Proveedor> findById(Long id);
}
