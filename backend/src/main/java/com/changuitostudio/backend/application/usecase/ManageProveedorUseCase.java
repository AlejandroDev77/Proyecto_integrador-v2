package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Proveedor;

import java.util.Map;
import java.util.Optional;

public interface ManageProveedorUseCase {
    PageResult<Proveedor> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Proveedor> obtenerPorId(Long id);
    Proveedor crear(Proveedor proveedor);
    Proveedor actualizar(Long id, Proveedor proveedor);
    void eliminar(Long id);
}
