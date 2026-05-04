package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Rol_Permiso;

import java.util.Optional;
import java.util.Map;

public interface RolPermisoRepository {


    PageResult<Rol_Permiso> buscarTodos(int page, int size, Map<String, String> filters, String sort);

    Optional<Rol_Permiso> buscarPorId(Long id);
    
    Rol_Permiso guardar(Rol_Permiso rolPermiso);

    void eliminarPorId(Long id);




    
}
