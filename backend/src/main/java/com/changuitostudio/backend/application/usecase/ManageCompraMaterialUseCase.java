package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.CompraMaterial;

import java.util.Map;
import java.util.Optional;

public interface ManageCompraMaterialUseCase {
    PageResult<CompraMaterial> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<CompraMaterial> obtenerPorId(Long id);
    CompraMaterial crear(CompraMaterial compramaterial);
    CompraMaterial actualizar(Long id, CompraMaterial compramaterial);
    void eliminar(Long id);
}
