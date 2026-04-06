package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.domain.model.Usuario;

/**
 * Caso de uso: Registrar un nuevo usuario.
 */
public interface RegisterUseCase {

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param nombreUsuario nombre de usuario
     * @param email         email del usuario
     * @param password      contraseÃ±a en texto plano
     * @param idRol         ID del rol asignado
     * @return el usuario creado
     */
    Usuario register(String nombreUsuario, String email, String password, Long idRol);
}

