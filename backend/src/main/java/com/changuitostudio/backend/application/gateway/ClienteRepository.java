package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Cliente;

import java.util.Map;
import java.util.Optional;

public interface ClienteRepository {
    PageResult<Cliente> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Cliente> obtenerPorId(Long id);
    Cliente guardar(Cliente cliente);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    Optional<Cliente> findById(Long id);
    Optional<Cliente> findByUsuarioId(Long idUsu);
}
