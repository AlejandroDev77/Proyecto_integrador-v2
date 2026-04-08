package com.changuitostudio.backend.domain.exception;

public class CategoriaNoEncontradoException extends RuntimeException {
    public CategoriaNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
