package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleVenta;

import java.util.Map;
import java.util.Optional;

public interface DetalleVentaRepository {
    PageResult<DetalleVenta> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleVenta> obtenerPorId(Long id);
    DetalleVenta guardar(DetalleVenta detalleventa);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    DetalleVenta save(DetalleVenta detalleVenta);
}
