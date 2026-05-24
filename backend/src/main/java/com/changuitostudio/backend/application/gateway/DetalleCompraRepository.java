package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleCompra;

import java.util.Map;
import java.util.Optional;

public interface DetalleCompraRepository {
    PageResult<DetalleCompra> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleCompra> obtenerPorId(Long id);
    DetalleCompra guardar(DetalleCompra detallecompra);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    DetalleCompra save(DetalleCompra detalleCompra);
}
