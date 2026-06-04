package com.changuitostudio.backend.application.usecase;



import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Permiso;


import java.util.Map;
import java.util.Optional;


public interface ManagePermisoUseCase {

    PageResult<Permiso> listarPermisos (int page, int perPage, Map<String, String> filters, String sort);

    Optional<Permiso> obtenerPorId(Long id);

    Permiso crear(Permiso permiso);

    Permiso actualizar(Long id, Permiso permiso);
    
    void eliminar(Long id);



    

    
}
