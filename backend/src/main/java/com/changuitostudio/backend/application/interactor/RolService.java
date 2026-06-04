package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageRolUseCase;
import com.changuitostudio.backend.application.gateway.RolRepository;
import com.changuitostudio.backend.domain.exception.RolNoEncontradoException;
import com.changuitostudio.backend.domain.model.Rol;


import java.util.Map;
import java.util.Optional;



public class RolService implements ManageRolUseCase {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    public PageResult<Rol> listarRoles(int page, int perPage, Map<String, String> filters, String sort) {
        return rolRepository.buscarTodos(page, perPage, filters, sort);
    }

    @Override
    public Optional<Rol> obtenerPorId(Long id) {
        return rolRepository.buscarPorId(id);
    }

    @Override
    public Rol crear(Rol rol) {
        return rolRepository.guardar(rol);
    }

    @Override
    public Rol actualizar(Long id, Rol rol) {
        Rol existente = rolRepository.buscarPorId(id)
                .orElseThrow(() -> new RolNoEncontradoException("Rol no encontrado con ID: " + id));
        
        if (rol.getNomRol() != null) {
            existente.setNomRol(rol.getNomRol());
        }
        
        return rolRepository.guardar(existente);
    }

    @Override
    public void eliminar(Long id) {
        rolRepository.buscarPorId(id)
                .orElseThrow(() -> new RolNoEncontradoException("Rol no encontrado con ID: " + id));
        rolRepository.eliminarPorId(id);
    }
}


