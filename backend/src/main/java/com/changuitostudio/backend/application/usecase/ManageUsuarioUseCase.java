package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Usuario;

import java.util.Map;
import java.util.Optional;

/**
 * Caso de uso: Gestionar usuarios (CRUD).
 */
public interface ManageUsuarioUseCase {

    PageResult<Usuario> listarUsuarios(int page, int perPage, Map<String, String> filters, String sort);

    Optional<Usuario> obtenerPorId(Long id);

    Usuario crear(Usuario usuario);

    Usuario actualizar(Long id, Usuario usuario);

    void eliminar(Long id);

    Usuario cambiarEstado(Long id, Boolean nuevoEstado);

    Optional<Usuario> obtenerPorNombre(String nomUsu);

    boolean existePorNomUsu(String nomUsu);

    boolean existePorEmail(String email);
}

