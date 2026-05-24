package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleProduccion;

import java.util.Map;
import java.util.Optional;

public interface DetalleProduccionRepository {
    PageResult<DetalleProduccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleProduccion> obtenerPorId(Long id);
    DetalleProduccion guardar(DetalleProduccion detalleproduccion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    DetalleProduccion save(DetalleProduccion detalleProduccion);
}
