package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.DetalleCompra;

import java.util.Map;
import java.util.Optional;

public interface ManageDetalleCompraUseCase {
    PageResult<DetalleCompra> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<DetalleCompra> obtenerPorId(Long id);
    DetalleCompra crear(DetalleCompra detallecompra);
    DetalleCompra actualizar(Long id, DetalleCompra detallecompra);
    void eliminar(Long id);
}
