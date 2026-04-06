package com.changuitostudio.backend.infrastructure.config;

import com.changuitostudio.backend.application.gateway.JwtProvider;
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
 * ImplementaciÃ³n de JwtProvider usando la librerÃ­a jjwt.
 */
@Component
public class JwtUtil implements JwtProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret:jdsaidjwhfuwfaiw00000iwwqi00i_must_be_32_chars_min}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationMs) {

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    @Override
    public String generateToken(Long idUsu, Long idRol, String codUsu, String nomUsu, String emailUsu,
            List<String> permisos) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(String.valueOf(idUsu))
                .claims(Map.of(
                        "id_usu", idUsu,
                        "id_rol", idRol,
                        "nom_usu", nomUsu != null ? nomUsu : "",
                        "email_usu", emailUsu != null ? emailUsu : "",
                        "cod_usu", codUsu != null ? codUsu : "",
                        "permisos", permisos))
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    @Override
    public String generate2faTempToken(Long idUsu) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + 300000); // 5 minutos

        return Jwts.builder()
                .subject(String.valueOf(idUsu))
                .claims(Map.of("is_2fa_pending", true))
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    @Override
    public String getSubjectFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    @Override
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

