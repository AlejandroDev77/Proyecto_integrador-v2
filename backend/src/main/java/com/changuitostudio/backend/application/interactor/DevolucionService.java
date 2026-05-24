package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DevolucionRepository;
import com.changuitostudio.backend.application.usecase.ManageDevolucionUseCase;
import com.changuitostudio.backend.domain.exception.DevolucionNoEncontradoException;
import com.changuitostudio.backend.domain.model.Devolucion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DevolucionService implements ManageDevolucionUseCase {

    private final DevolucionRepository repository;

    public DevolucionService(DevolucionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Devolucion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Devolucion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Devolucion crear(Devolucion devolucion) {
        return repository.guardar(devolucion);
    }

    @Override
    public Devolucion actualizar(Long id, Devolucion devolucion) {
        return repository.obtenerPorId(id).map(existing -> {
            devolucion.setId(id);
            return repository.guardar(devolucion);
        }).orElseThrow(() -> new DevolucionNoEncontradoException("Devolucion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DevolucionNoEncontradoException("Devolucion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
