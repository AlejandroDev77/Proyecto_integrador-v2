package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Devolucion;

import java.util.Map;
import java.util.Optional;

public interface DevolucionRepository {
    PageResult<Devolucion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Devolucion> obtenerPorId(Long id);
    Devolucion guardar(Devolucion devolucion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    long countByFecDevMonth(int month, int year);
    Devolucion save(Devolucion devolucion);
}
