package com.changuitostudio.backend.application.gateway;

import java.util.List;

/**
 * Puerto de salida: GeneraciÃ³n y validaciÃ³n de JWT.
 * La implementaciÃ³n concreta (jjwt, etc.) estÃ¡ en infrastructure.
 */
public interface JwtProvider {

    String generateToken(Long idUsu, Long idRol, String codUsu, String nomUsu, String emailUsu, List<String> permisos);

    String generate2faTempToken(Long idUsu);

    String getSubjectFromToken(String token);

    boolean validateToken(String token);
}

