package com.changuitostudio.backend.domain.exception;

public class PermisoNoEncontradoException extends RuntimeException {

    public PermisoNoEncontradoException(Long id) {
        super("Permiso no encontrado con id: " + id);
    }

    public PermisoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
    
}
