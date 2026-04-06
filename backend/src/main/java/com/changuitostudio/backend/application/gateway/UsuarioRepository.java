package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Usuario;

import java.util.Map;
import java.util.Optional;

/**
 * Puerto de salida: Persistencia de usuarios.
 * Define el contrato SIN conocer JPA, Specification ni ninguna tecnologÃ­a.
 */
public interface UsuarioRepository {

    PageResult<Usuario> buscarTodos(int page, int size, Map<String, String> filters, String sort);

    Optional<Usuario> buscarPorId(Long id);

    Optional<Usuario> buscarPorNombre(String nomUsu);

    Optional<Usuario> buscarPorEmail(String email);

    Usuario guardar(Usuario usuario);

    void eliminarPorId(Long id);

    String generarCodigoUnico();

    boolean existePorNomUsu(String nomUsu);

    boolean existePorEmail(String email);
}

