package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleCotizacion;

import java.util.Map;
import java.util.Optional;

public interface ManageDetalleCotizacionUseCase {
    PageResult<DetalleCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleCotizacion> obtenerPorId(Long id);
    DetalleCotizacion crear(DetalleCotizacion detallecotizacion);
    DetalleCotizacion actualizar(Long id, DetalleCotizacion detallecotizacion);
    void eliminar(Long id);
}
