package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Cotizacion;

import java.util.Map;
import java.util.Optional;

public interface CotizacionRepository {
    PageResult<Cotizacion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Cotizacion> obtenerPorId(Long id);
    Cotizacion guardar(Cotizacion cotizacion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    long countByEstCot(String estado);
    Optional<Cotizacion> findById(Long id);
    Cotizacion save(Cotizacion cotizacion);
}
