package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.PermisoRepository;
import com.changuitostudio.backend.application.usecase.ManagePermisoUseCase;
import com.changuitostudio.backend.domain.exception.PermisoNoEncontradoException;
import com.changuitostudio.backend.domain.model.Permiso;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class PermisoService implements ManagePermisoUseCase {

    private final PermisoRepository permisoRepository;

   
    public PermisoService(PermisoRepository permisoRepository) {
        this.permisoRepository = permisoRepository;
    }

    @Override
    public PageResult<Permiso> listarPermisos(int page, int perPage, Map<String, String> filters, String sort) {
        return permisoRepository.buscarTodos(page, perPage, filters, sort);
    }

    @Override
    public Optional<Permiso> obtenerPorId(Long id) {
        return permisoRepository.buscarPorId(id);
    }

    @Override
    public Permiso crear(Permiso permiso) {
        return permisoRepository.guardar(permiso);
    }

    @Override
    public Permiso actualizar(Long id, Permiso permiso) {
        Permiso existente = permisoRepository.buscarPorId(id)
                .orElseThrow(() -> new PermisoNoEncontradoException("Permiso no encontrado con ID: " + id));
        
        if (permiso.getNomPermiso() != null) {
            existente.setNomPermiso(permiso.getNomPermiso());
        }
        
        if (permiso.getDescripcion() != null) {
            existente.setDescripcion(permiso.getDescripcion());
        }
        
        return permisoRepository.guardar(existente);
    }
    
    @Override
    public void eliminar(Long id) {
        permisoRepository.buscarPorId(id)
                .orElseThrow(() -> new PermisoNoEncontradoException("Permiso no encontrado con ID: " + id));
        permisoRepository.eliminarPorId(id);
    }
}
