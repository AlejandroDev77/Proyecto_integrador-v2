package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleDevolucion;

import java.util.Map;
import java.util.Optional;

public interface ManageDetalleDevolucionUseCase {
    PageResult<DetalleDevolucion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleDevolucion> obtenerPorId(Long id);
    DetalleDevolucion crear(DetalleDevolucion detalledevolucion);
    DetalleDevolucion actualizar(Long id, DetalleDevolucion detalledevolucion);
    void eliminar(Long id);
}
