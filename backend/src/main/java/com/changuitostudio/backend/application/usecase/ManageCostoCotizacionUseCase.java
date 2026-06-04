package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.CostoCotizacion;

import java.util.Map;
import java.util.Optional;

public interface ManageCostoCotizacionUseCase {
    PageResult<CostoCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<CostoCotizacion> obtenerPorId(Long id);
    CostoCotizacion crear(CostoCotizacion costocotizacion);
    CostoCotizacion actualizar(Long id, CostoCotizacion costocotizacion);
    void eliminar(Long id);
}
