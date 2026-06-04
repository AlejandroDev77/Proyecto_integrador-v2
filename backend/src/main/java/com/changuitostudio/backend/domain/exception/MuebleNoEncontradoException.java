package com.changuitostudio.backend.domain.exception;

public class MuebleNoEncontradoException extends RuntimeException {
    public MuebleNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
