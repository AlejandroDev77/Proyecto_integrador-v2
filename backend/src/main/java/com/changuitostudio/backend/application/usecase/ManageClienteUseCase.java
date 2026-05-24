package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Cliente;

import java.util.Map;
import java.util.Optional;

public interface ManageClienteUseCase {
    PageResult<Cliente> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Cliente> obtenerPorId(Long id);
    Cliente crear(Cliente cliente);
    Cliente actualizar(Long id, Cliente cliente);
    void eliminar(Long id);
}
