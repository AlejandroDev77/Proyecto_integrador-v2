package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.EmpleadoRepository;
import com.changuitostudio.backend.application.usecase.ManageEmpleadoUseCase;
import com.changuitostudio.backend.domain.exception.EmpleadoNoEncontradoException;
import com.changuitostudio.backend.domain.model.Empleado;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class EmpleadoService implements ManageEmpleadoUseCase {

    private final EmpleadoRepository repository;

    public EmpleadoService(EmpleadoRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Empleado> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Empleado> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Empleado crear(Empleado empleado) {
        return repository.guardar(empleado);
    }

    @Override
    public Empleado actualizar(Long id, Empleado empleado) {
        return repository.obtenerPorId(id).map(existing -> {
            empleado.setId(id);
            return repository.guardar(empleado);
        }).orElseThrow(() -> new EmpleadoNoEncontradoException("Empleado no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new EmpleadoNoEncontradoException("Empleado no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
