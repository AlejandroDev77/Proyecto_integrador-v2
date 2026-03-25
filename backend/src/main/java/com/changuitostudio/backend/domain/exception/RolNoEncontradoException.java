package com.changuitostudio.backend.domain.exception;

public class RolNoEncontradoException extends RuntimeException {

    public RolNoEncontradoException(Long id) {
        super("Rol no encontrado con id: " + id);
    }

    public RolNoEncontradoException(String mensaje) {
        super(mensaje);
    }

    
}
