package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ProveedorRepository;
import com.changuitostudio.backend.application.usecase.ManageProveedorUseCase;
import com.changuitostudio.backend.domain.exception.ProveedorNoEncontradoException;
import com.changuitostudio.backend.domain.model.Proveedor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ProveedorService implements ManageProveedorUseCase {

    private final ProveedorRepository repository;

    public ProveedorService(ProveedorRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Proveedor> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Proveedor> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Proveedor crear(Proveedor proveedor) {
        return repository.guardar(proveedor);
    }

    @Override
    public Proveedor actualizar(Long id, Proveedor proveedor) {
        return repository.obtenerPorId(id).map(existing -> {
            proveedor.setId(id);
            return repository.guardar(proveedor);
        }).orElseThrow(() -> new ProveedorNoEncontradoException("Proveedor no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new ProveedorNoEncontradoException("Proveedor no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
