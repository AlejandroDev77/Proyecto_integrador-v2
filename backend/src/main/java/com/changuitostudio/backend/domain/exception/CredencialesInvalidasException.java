package com.changuitostudio.backend.domain.exception;

public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException() {
        super("Credenciales incorrectas");
    }

    public CredencialesInvalidasException(String mensaje) {
        super(mensaje);
    }
}
