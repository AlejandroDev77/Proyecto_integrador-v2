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
        Proveedor guardado = repository.guardar(proveedor);
        if (guardado.getCodProv() == null || guardado.getCodProv().trim().isEmpty()) {
            guardado.setCodProv("PROV-" + guardado.getId());
            guardado = repository.guardar(guardado);
        }
        return guardado;
    }

    @Override
    public Proveedor actualizar(Long id, Proveedor proveedor) {
        return repository.obtenerPorId(id).map(existing -> {
            if (proveedor.getNomProv() != null) existing.setNomProv(proveedor.getNomProv());
            if (proveedor.getContactoProv() != null) existing.setContactoProv(proveedor.getContactoProv());
            if (proveedor.getTelProv() != null) existing.setTelProv(proveedor.getTelProv());
            if (proveedor.getEmailProv() != null) existing.setEmailProv(proveedor.getEmailProv());
            if (proveedor.getDirProv() != null) existing.setDirProv(proveedor.getDirProv());
            if (proveedor.getNitProv() != null) existing.setNitProv(proveedor.getNitProv());
            if (proveedor.getEstProv() != null) existing.setEstProv(proveedor.getEstProv());
            if (proveedor.getCodProv() != null) existing.setCodProv(proveedor.getCodProv());

            return repository.guardar(existing);
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
