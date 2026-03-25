package com.changuitostudio.backend.application.service;

import com.changuitostudio.backend.application.port.in.RolesServicePort;
import com.changuitostudio.backend.application.port.out.RolPersistencePort;
import com.changuitostudio.backend.domain.exception.RolNoEncontradoException;
import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.RolSpecifications;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

// Servicio de aplicación - Implementa el puerto de entrada para Roles
@Service
public class RolService implements RolesServicePort {

    private final RolPersistencePort persistencePort;

    public RolService(RolPersistencePort persistencePort) {
        this.persistencePort = persistencePort;
    }

    @Override
    public Page<Rol> listarRoles(int page, int perPage, Map<String, String> filters, String sort) {
        var spec = RolSpecifications.fromFilters(filters);
        Pageable pageable = buildPageable(page, perPage, sort);
        return persistencePort.buscarTodos(spec, pageable);
    }

    @Override
    public Optional<Rol> obtenerPorId(Long id) {
        return persistencePort.buscarPorId(id);
    }

    @Override
    public Rol crear(Rol rol) {
        return persistencePort.guardar(rol);
    }

    @Override
    public Rol actualizar(Long id, Rol rol) {
        Rol rolExistente = persistencePort.buscarPorId(id)
                .orElseThrow(() -> new RolNoEncontradoException("Rol no encontrado con ID: " + id));
        rolExistente.setId(id);
        return persistencePort.guardar(rolExistente);
    }

    @Override
    public void eliminar(Long id) {
        persistencePort.buscarPorId(id)
                .orElseThrow(() -> new RolNoEncontradoException("Rol no encontrado con ID: " + id));
        persistencePort.eliminarPorId(id);
    }

    private Pageable buildPageable(int page, int perPage, String sort) {
        if (sort == null || sort.isEmpty()) {
            return PageRequest.of(page - 1, perPage); // Sin ordenamiento
        }
        String[] sortParts = sort.split(":");
        if (sortParts.length != 2) {
            throw new IllegalArgumentException("Formato de ordenamiento inválido. Use 'campo:asc' o 'campo:desc'.");
        }
        String field = sortParts[0];
        Sort.Direction direction = sortParts[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page - 1, perPage, Sort.by(direction, field));
    }
}
