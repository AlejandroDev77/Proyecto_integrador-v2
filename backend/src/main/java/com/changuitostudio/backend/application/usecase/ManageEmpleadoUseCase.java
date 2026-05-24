package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Empleado;

import java.util.Map;
import java.util.Optional;

public interface ManageEmpleadoUseCase {
    PageResult<Empleado> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Empleado> obtenerPorId(Long id);
    Empleado crear(Empleado empleado);
    Empleado actualizar(Long id, Empleado empleado);
    void eliminar(Long id);
}
