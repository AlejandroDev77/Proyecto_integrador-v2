package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DisenoRepository;
import com.changuitostudio.backend.application.usecase.ManageDisenoUseCase;
import com.changuitostudio.backend.domain.exception.DisenoNoEncontradoException;
import com.changuitostudio.backend.domain.model.Diseno;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class DisenoService implements ManageDisenoUseCase {

    private final DisenoRepository repository;

    public DisenoService(DisenoRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Diseno> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Diseno> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Diseno crear(Diseno diseno) {
        return repository.guardar(diseno);
    }

    @Override
    public Diseno actualizar(Long id, Diseno diseno) {
        return repository.obtenerPorId(id).map(existing -> {
            diseno.setId(id);
            return repository.guardar(diseno);
        }).orElseThrow(() -> new DisenoNoEncontradoException("Diseno no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new DisenoNoEncontradoException("Diseno no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
