package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ClienteRepository;
import com.changuitostudio.backend.application.usecase.ManageClienteUseCase;
import com.changuitostudio.backend.domain.exception.ClienteNoEncontradoException;
import com.changuitostudio.backend.domain.model.Cliente;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ClienteService implements ManageClienteUseCase {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Cliente> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<Cliente> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public Cliente crear(Cliente cliente) {
        Cliente guardado = repository.guardar(cliente);
        if (guardado.getCodCli() == null || guardado.getCodCli().trim().isEmpty()) {
            guardado.setCodCli("CLI-" + guardado.getId());
            guardado = repository.guardar(guardado);
        }
        return guardado;
    }

    @Override
    public Cliente actualizar(Long id, Cliente cliente) {
        return repository.obtenerPorId(id).map(existing -> {
            if (cliente.getNomCli() != null) existing.setNomCli(cliente.getNomCli());
            if (cliente.getApPatCli() != null) existing.setApPatCli(cliente.getApPatCli());
            if (cliente.getApMatCli() != null) existing.setApMatCli(cliente.getApMatCli());
            if (cliente.getCelCli() != null) existing.setCelCli(cliente.getCelCli());
            if (cliente.getDirCli() != null) existing.setDirCli(cliente.getDirCli());
            if (cliente.getFecNacCli() != null) existing.setFecNacCli(cliente.getFecNacCli());
            if (cliente.getCiCli() != null) existing.setCiCli(cliente.getCiCli());
            if (cliente.getImgCli() != null && !cliente.getImgCli().isEmpty()) existing.setImgCli(cliente.getImgCli());
            if (cliente.getId_usu() != null) existing.setId_usu(cliente.getId_usu());
            if (cliente.getEstCli() != null) existing.setEstCli(cliente.getEstCli());
            if (cliente.getCodCli() != null) existing.setCodCli(cliente.getCodCli());

            return repository.guardar(existing);
        }).orElseThrow(() -> new ClienteNoEncontradoException("Cliente no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        if (repository.obtenerPorId(id).isEmpty()) {
            throw new ClienteNoEncontradoException("Cliente no encontrado con ID: " + id);
        }
        repository.eliminar(id);
    }
}
