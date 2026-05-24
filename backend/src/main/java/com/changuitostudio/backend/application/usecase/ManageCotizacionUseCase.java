package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Cotizacion;

import java.util.Map;
import java.util.Optional;

public interface ManageCotizacionUseCase {
    PageResult<Cotizacion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Cotizacion> obtenerPorId(Long id);
    Cotizacion crear(Cotizacion cotizacion);
    Cotizacion actualizar(Long id, Cotizacion cotizacion);
    void eliminar(Long id);
}
