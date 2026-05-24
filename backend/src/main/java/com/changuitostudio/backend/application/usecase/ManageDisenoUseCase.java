package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Diseno;

import java.util.Map;
import java.util.Optional;

public interface ManageDisenoUseCase {
    PageResult<Diseno> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Diseno> obtenerPorId(Long id);
    Diseno crear(Diseno diseno);
    Diseno actualizar(Long id, Diseno diseno);
    void eliminar(Long id);
}
