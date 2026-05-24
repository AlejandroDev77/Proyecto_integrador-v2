package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Venta;

import java.util.Map;
import java.util.Optional;

public interface ManageVentaUseCase {
    PageResult<Venta> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Venta> obtenerPorId(Long id);
    Venta crear(Venta venta);
    Venta actualizar(Long id, Venta venta);
    void eliminar(Long id);
}
