package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Devolucion;

import java.util.Map;
import java.util.Optional;

public interface ManageDevolucionUseCase {
    PageResult<Devolucion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Devolucion> obtenerPorId(Long id);
    Devolucion crear(Devolucion devolucion);
    Devolucion actualizar(Long id, Devolucion devolucion);
    void eliminar(Long id);
}
