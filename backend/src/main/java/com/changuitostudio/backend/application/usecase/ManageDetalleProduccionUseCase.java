package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleProduccion;

import java.util.Map;
import java.util.Optional;

public interface ManageDetalleProduccionUseCase {
    PageResult<DetalleProduccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleProduccion> obtenerPorId(Long id);
    DetalleProduccion crear(DetalleProduccion detalleproduccion);
    DetalleProduccion actualizar(Long id, DetalleProduccion detalleproduccion);
    void eliminar(Long id);
}
