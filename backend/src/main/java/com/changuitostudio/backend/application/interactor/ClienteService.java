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
        return repository.guardar(cliente);
    }

    @Override
    public Cliente actualizar(Long id, Cliente cliente) {
        return repository.obtenerPorId(id).map(existing -> {
            cliente.setId(id);
            return repository.guardar(cliente);
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
