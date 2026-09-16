package com.changuitostudio.backend.application.gateway;

import java.util.List;


public interface JwtProvider {

    String generateToken(Long idUsu, Long idRol, String codUsu, String nomUsu, String emailUsu,
                         List<String> permisos, String passwordHash);

    String generate2faTempToken(Long idUsu, String passwordHash);

    String getSubjectFromToken(String token);

    Long getRoleIdFromToken(String token);

    List<String> getPermissionsFromToken(String token);

    boolean validateToken(String token);

    boolean isAccessToken(String token);

    boolean is2faTempToken(String token);

    boolean matchesCredentialVersion(String token, String passwordHash);

    void revokeToken(String token);
}

