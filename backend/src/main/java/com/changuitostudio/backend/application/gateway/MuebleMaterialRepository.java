package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.MuebleMaterial;

import java.util.Map;
import java.util.Optional;

public interface MuebleMaterialRepository {
    PageResult<MuebleMaterial> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<MuebleMaterial> obtenerPorId(Long id);
    MuebleMaterial guardar(MuebleMaterial mueblematerial);
    void eliminar(Long id);
}
