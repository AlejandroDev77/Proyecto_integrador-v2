package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleDevolucion;

import java.util.Map;
import java.util.Optional;

public interface DetalleDevolucionRepository {
    PageResult<DetalleDevolucion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleDevolucion> obtenerPorId(Long id);
    DetalleDevolucion guardar(DetalleDevolucion detalledevolucion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    DetalleDevolucion save(DetalleDevolucion detalleDevolucion);
}
