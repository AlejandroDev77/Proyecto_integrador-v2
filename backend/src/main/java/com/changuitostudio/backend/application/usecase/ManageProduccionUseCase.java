package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Produccion;

import java.util.Map;
import java.util.Optional;

public interface ManageProduccionUseCase {
    PageResult<Produccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Produccion> obtenerPorId(Long id);
    Produccion crear(Produccion produccion);
    Produccion actualizar(Long id, Produccion produccion);
    void eliminar(Long id);
}
