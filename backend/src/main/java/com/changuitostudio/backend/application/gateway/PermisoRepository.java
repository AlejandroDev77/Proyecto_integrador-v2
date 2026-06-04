package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Permiso;


import java.util.Map;
import java.util.Optional;

public interface PermisoRepository {


    PageResult<Permiso> buscarTodos(int page, int size, Map<String, String> filters, String sort);

    Optional<Permiso> buscarPorId(Long id);

    Permiso guardar(Permiso permiso);

    void eliminarPorId(Long id);

    
}
