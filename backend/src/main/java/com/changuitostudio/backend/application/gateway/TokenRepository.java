package com.changuitostudio.backend.application.gateway;

//import com.changuitostudio.backend.domain.model.Usuario;

import java.util.Optional;

/**
 * Puerto de salida: para gestión de tokens jwt
 */
public interface TokenRepository {

    void guardarToken(String token, Long usuarioId, String tokenType, int horasExpiracion);

    Optional<TokenData> buscarPorToken(String token);

    void eliminarToken(String token);

    /**
     * Datos del token (sin acoplamiento a entidades JPA).
     */
    record TokenData(
            String token,
            Long usuarioId,
            String tokenType,
            boolean expired
    ) {}
}

