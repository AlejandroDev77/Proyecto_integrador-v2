package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleCotizacion;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DetalleCotizacionRepository {
    PageResult<DetalleCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleCotizacion> obtenerPorId(Long id);
    DetalleCotizacion guardar(DetalleCotizacion detallecotizacion);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    List<DetalleCotizacion> findByCotizacionId(Long idCot);
    DetalleCotizacion save(DetalleCotizacion detalleCotizacion);
    Optional<DetalleCotizacion> findById(Long id);
}
