package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleProduccionRepository;
import com.changuitostudio.backend.application.usecase.ManageDetalleProduccionUseCase;
import com.changuitostudio.backend.domain.exception.DetalleProduccionNoEncontradoException;
import com.changuitostudio.backend.domain.model.DetalleProduccion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DetalleProduccionService implements ManageDetalleProduccionUseCase {

    private final DetalleProduccionRepository repository;

    public DetalleProduccionService(DetalleProduccionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleProduccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<DetalleProduccion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public DetalleProduccion crear(DetalleProduccion detalleproduccion) {
        return repository.guardar(detalleproduccion);
    }

    @Override
    public DetalleProduccion actualizar(Long id, DetalleProduccion detalleproduccion) {
        return repository.obtenerPorId(id).map(existing -> {
            detalleproduccion.setId(id);
            return repository.guardar(detalleproduccion);
        }).orElseThrow(() -> new DetalleProduccionNoEncontradoException("DetalleProduccion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DetalleProduccionNoEncontradoException("DetalleProduccion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
