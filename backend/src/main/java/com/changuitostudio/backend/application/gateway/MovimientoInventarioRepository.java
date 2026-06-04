package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.MovimientoInventario;

import java.util.Map;
import java.util.Optional;

public interface MovimientoInventarioRepository {
    PageResult<MovimientoInventario> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<MovimientoInventario> obtenerPorId(Long id);
    MovimientoInventario guardar(MovimientoInventario movimientoinventario);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    MovimientoInventario save(MovimientoInventario movimiento);
}
