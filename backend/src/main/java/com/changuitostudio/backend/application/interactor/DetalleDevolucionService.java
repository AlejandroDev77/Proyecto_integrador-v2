package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleDevolucionRepository;
import com.changuitostudio.backend.application.usecase.ManageDetalleDevolucionUseCase;
import com.changuitostudio.backend.domain.exception.DetalleDevolucionNoEncontradoException;
import com.changuitostudio.backend.domain.model.DetalleDevolucion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DetalleDevolucionService implements ManageDetalleDevolucionUseCase {

    private final DetalleDevolucionRepository repository;

    public DetalleDevolucionService(DetalleDevolucionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleDevolucion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<DetalleDevolucion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public DetalleDevolucion crear(DetalleDevolucion detalledevolucion) {
        return repository.guardar(detalledevolucion);
    }

    @Override
    public DetalleDevolucion actualizar(Long id, DetalleDevolucion detalledevolucion) {
        return repository.obtenerPorId(id).map(existing -> {
            detalledevolucion.setId(id);
            return repository.guardar(detalledevolucion);
        }).orElseThrow(() -> new DetalleDevolucionNoEncontradoException("DetalleDevolucion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DetalleDevolucionNoEncontradoException("DetalleDevolucion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
