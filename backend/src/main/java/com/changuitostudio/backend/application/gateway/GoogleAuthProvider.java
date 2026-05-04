package com.changuitostudio.backend.application.gateway;

public interface GoogleAuthProvider {

    /**
     * Resultado de verificar un token de Google.
     */
    record GoogleUserInfo(
            String email,
            String nombre,
            String foto
    ) {}

    /**
     * Verifica el ID token de Google y retorna la info del usuario.
     */
    GoogleUserInfo verifyToken(String idTokenString) throws Exception;
}

