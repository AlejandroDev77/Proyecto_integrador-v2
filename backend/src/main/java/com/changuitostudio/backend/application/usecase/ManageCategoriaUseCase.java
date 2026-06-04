package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Categoria;

import java.util.Map;
import java.util.Optional;

public interface ManageCategoriaUseCase {

    PageResult<Categoria> listarCategorias(int page, int perPage, Map<String, String> filters, String sort);

    Optional<Categoria> obtenerPorId(Long id);

    Categoria crear(Categoria categoria);

    Categoria actualizar(Long id, Categoria categoria);

    void eliminar(Long id);
}
