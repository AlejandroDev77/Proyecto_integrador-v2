package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Categoria;

import java.util.Map;
import java.util.Optional;

public interface CategoriaRepository {

    PageResult<Categoria> buscarTodos(int page, int size, Map<String, String> filters, String sort);

    Optional<Categoria> buscarPorId(Long id);

    Categoria guardar(Categoria categoria);

    void eliminarPorId(Long id);
}
