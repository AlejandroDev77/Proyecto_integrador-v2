package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.MovimientoInventario;

import java.util.Map;
import java.util.Optional;

public interface ManageMovimientoInventarioUseCase {
    PageResult<MovimientoInventario> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<MovimientoInventario> obtenerPorId(Long id);
    MovimientoInventario crear(MovimientoInventario movimientoinventario);
    MovimientoInventario actualizar(Long id, MovimientoInventario movimientoinventario);
    void eliminar(Long id);
}
