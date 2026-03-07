package com.changuitostudio.backend.infrastructure.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Utilidad JWT — Genera y valida tokens con claims personalizados.
 * Claims idénticos al JWT de Laravel: id_usu, id_rol, cod_usu, permisos.
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret:ChanguitoStudiosSecretKeyQueDebeSerLargaYSegura2026!}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationMs) {
        // Asegurar que la clave tenga al menos 256 bits
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    /**
     * Genera un JWT con claims personalizados (idéntico a lo que hacía Laravel).
     */
    public String generateToken(Long idUsu, Long idRol, String codUsu, List<String> permisos) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(String.valueOf(idUsu))
                .claims(Map.of(
                        "id_usu", idUsu,
                        "id_rol", idRol,
                        "cod_usu", codUsu != null ? codUsu : "",
                        "permisos", permisos))
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    /**
     * Extrae el subject (id_usu) del token.
     */
    public String getSubjectFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Valida si el token es correcto y no ha expirado.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
