package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Rol;

import java.util.Map;
import java.util.Optional;


public interface RolRepository {

    PageResult<Rol> buscarTodos(int page, int size, Map<String, String> filters, String sort);

    Optional<Rol> buscarPorId(Long id);

    Rol guardar(Rol rol);

    void eliminarPorId(Long id);
}

