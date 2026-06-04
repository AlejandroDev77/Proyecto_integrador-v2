package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Empleado;

import java.util.Map;
import java.util.Optional;

public interface EmpleadoRepository {
    PageResult<Empleado> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Empleado> obtenerPorId(Long id);
    Empleado guardar(Empleado empleado);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    Optional<Empleado> findById(Long id);
}
