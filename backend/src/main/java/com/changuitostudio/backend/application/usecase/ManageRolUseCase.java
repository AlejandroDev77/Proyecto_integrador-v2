package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Rol;

import java.util.Map;
import java.util.Optional;

/**
 * Caso de uso: Gestionar roles (CRUD).
 */
public interface ManageRolUseCase {

    PageResult<Rol> listarRoles(int page, int perPage, Map<String, String> filters, String sort);

    Optional<Rol> obtenerPorId(Long id);

    Rol crear(Rol rol);

    Rol actualizar(Long id, Rol rol);

    void eliminar(Long id);
}

