package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.CostoCotizacion;

import java.util.Map;
import java.util.Optional;

public interface CostoCotizacionRepository {
    PageResult<CostoCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<CostoCotizacion> obtenerPorId(Long id);
    CostoCotizacion guardar(CostoCotizacion costocotizacion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    CostoCotizacion save(CostoCotizacion costoCotizacion);
}
