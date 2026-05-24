package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MuebleMaterialRepository;
import com.changuitostudio.backend.application.usecase.ManageMuebleMaterialUseCase;
import com.changuitostudio.backend.domain.exception.MuebleMaterialNoEncontradoException;
import com.changuitostudio.backend.domain.model.MuebleMaterial;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class MuebleMaterialService implements ManageMuebleMaterialUseCase {

    private final MuebleMaterialRepository repository;

    public MuebleMaterialService(MuebleMaterialRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<MuebleMaterial> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<MuebleMaterial> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public MuebleMaterial crear(MuebleMaterial mueblematerial) {
        return repository.guardar(mueblematerial);
    }

    @Override
    public MuebleMaterial actualizar(Long id, MuebleMaterial mueblematerial) {
        return repository.obtenerPorId(id).map(existing -> {
            mueblematerial.setId(id);
            return repository.guardar(mueblematerial);
        }).orElseThrow(() -> new MuebleMaterialNoEncontradoException("MuebleMaterial no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new MuebleMaterialNoEncontradoException("MuebleMaterial no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
