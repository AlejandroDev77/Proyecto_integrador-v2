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
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import io.jsonwebtoken.Claims;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;


@Component
public class JwtUtil implements JwtProvider {

    private final SecretKey key;
    private final long expirationMs;
    private final Set<String> revokedTokenIds = ConcurrentHashMap.newKeySet();

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms:3600000}") long expirationMs) {

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    @Override
    public String generateToken(Long idUsu, Long idRol, String codUsu, String nomUsu, String emailUsu,
            List<String> permisos, String passwordHash) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(String.valueOf(idUsu))
                .claims(Map.of(
                        "token_type", "access",
                        "credential_version", fingerprint(passwordHash),
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
    public String generate2faTempToken(Long idUsu, String passwordHash) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + 300000); // 5 minutos

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(String.valueOf(idUsu))
                .claims(Map.of("token_type", "2fa_pending", "is_2fa_pending", true,
                        "credential_version", fingerprint(passwordHash)))
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
    public Long getRoleIdFromToken(String token) {
        Object roleId = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("id_rol");
        return roleId instanceof Number ? ((Number) roleId).longValue() : null;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<String> getPermissionsFromToken(String token) {
        Object permissions = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("permisos");
        if (!(permissions instanceof List<?> values)) return List.of();
        return values.stream().filter(String.class::isInstance).map(String.class::cast).toList();
    }

    @Override
    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getId() != null && !revokedTokenIds.contains(claims.getId());
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean isAccessToken(String token) {
        try {
            return validateToken(token) && "access".equals(parseClaims(token).get("token_type", String.class));
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean is2faTempToken(String token) {
        try {
            return validateToken(token) && "2fa_pending".equals(parseClaims(token).get("token_type", String.class));
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean matchesCredentialVersion(String token, String passwordHash) {
        try {
            String version = parseClaims(token).get("credential_version", String.class);
            return MessageDigest.isEqual(version.getBytes(StandardCharsets.UTF_8),
                    fingerprint(passwordHash).getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void revokeToken(String token) {
        if (!validateToken(token)) return;
        String tokenId = parseClaims(token).getId();
        if (tokenId != null) revokedTokenIds.add(tokenId);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    private String fingerprint(String passwordHash) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest((passwordHash == null ? "" : passwordHash).getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no está disponible", e);
        }
    }
}

