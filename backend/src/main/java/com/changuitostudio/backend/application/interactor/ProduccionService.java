package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ProduccionRepository;
import com.changuitostudio.backend.application.usecase.ManageProduccionUseCase;
import com.changuitostudio.backend.domain.exception.ProduccionNoEncontradoException;
import com.changuitostudio.backend.domain.model.Produccion;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ProduccionService implements ManageProduccionUseCase {

    private final ProduccionRepository repository;

    public ProduccionService(ProduccionRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Produccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Produccion> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Produccion crear(Produccion produccion) {
        return repository.guardar(produccion);
    }

    @Override
    public Produccion actualizar(Long id, Produccion produccion) {
        return repository.obtenerPorId(id).map(existing -> {
            produccion.setId(id);
            return repository.guardar(produccion);
        }).orElseThrow(() -> new ProduccionNoEncontradoException("Produccion no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new ProduccionNoEncontradoException("Produccion no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
