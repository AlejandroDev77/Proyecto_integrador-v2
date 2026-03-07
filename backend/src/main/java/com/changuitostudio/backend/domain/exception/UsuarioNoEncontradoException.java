package com.changuitostudio.backend.domain.exception;

/**
 * Excepción de dominio lanzada cuando un usuario no existe.
 */
public class UsuarioNoEncontradoException extends RuntimeException {

    public UsuarioNoEncontradoException(Long id) {
        super("Usuario no encontrado con id: " + id);
    }

    public UsuarioNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
