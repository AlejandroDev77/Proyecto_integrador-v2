package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Material;

import java.util.Map;
import java.util.Optional;

public interface ManageMaterialUseCase {
    PageResult<Material> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Material> obtenerPorId(Long id);
    Material crear(Material material);
    Material actualizar(Long id, Material material);
    void eliminar(Long id);
    void cambiarEstado(Long id, boolean estado);
}
