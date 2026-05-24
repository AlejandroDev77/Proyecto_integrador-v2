package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CompraMaterialRepository;
import com.changuitostudio.backend.application.usecase.ManageCompraMaterialUseCase;
import com.changuitostudio.backend.domain.exception.CompraMaterialNoEncontradoException;
import com.changuitostudio.backend.domain.model.CompraMaterial;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CompraMaterialService implements ManageCompraMaterialUseCase {

    private final CompraMaterialRepository repository;

    public CompraMaterialService(CompraMaterialRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<CompraMaterial> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<CompraMaterial> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public CompraMaterial crear(CompraMaterial compramaterial) {
        return repository.guardar(compramaterial);
    }

    @Override
    public CompraMaterial actualizar(Long id, CompraMaterial compramaterial) {
        return repository.obtenerPorId(id).map(existing -> {
            compramaterial.setId(id);
            return repository.guardar(compramaterial);
        }).orElseThrow(() -> new CompraMaterialNoEncontradoException("CompraMaterial no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new CompraMaterialNoEncontradoException("CompraMaterial no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
