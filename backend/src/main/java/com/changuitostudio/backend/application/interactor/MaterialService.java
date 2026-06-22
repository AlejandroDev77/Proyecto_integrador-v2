package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MaterialRepository;
import com.changuitostudio.backend.application.usecase.ManageMaterialUseCase;
import com.changuitostudio.backend.domain.exception.MaterialNoEncontradoException;
import com.changuitostudio.backend.domain.model.Material;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class MaterialService implements ManageMaterialUseCase {

    private final MaterialRepository repository;

    public MaterialService(MaterialRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Material> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Material> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Material crear(Material material) {
        return repository.guardar(material);
    }

    @Override
    public Material actualizar(Long id, Material material) {
        return repository.obtenerPorId(id).map(existing -> {
            material.setId(id);
            return repository.guardar(material);
        }).orElseThrow(() -> new MaterialNoEncontradoException("Material no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new MaterialNoEncontradoException("Material no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }

    @Override
    public void cambiarEstado(Long id, boolean estado) {
        repository.obtenerPorId(id).map(existing -> {
            existing.setEstMat(estado);
            return repository.guardar(existing);
        }).orElseThrow(() -> new MaterialNoEncontradoException("Material no encontrado con ID: " + id));
    }
}
