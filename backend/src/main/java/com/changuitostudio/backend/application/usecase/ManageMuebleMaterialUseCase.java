package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.MuebleMaterial;

import java.util.Map;
import java.util.Optional;

public interface ManageMuebleMaterialUseCase {
    PageResult<MuebleMaterial> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<MuebleMaterial> obtenerPorId(Long id);
    MuebleMaterial crear(MuebleMaterial mueblematerial);
    MuebleMaterial actualizar(Long id, MuebleMaterial mueblematerial);
    void eliminar(Long id);
}
