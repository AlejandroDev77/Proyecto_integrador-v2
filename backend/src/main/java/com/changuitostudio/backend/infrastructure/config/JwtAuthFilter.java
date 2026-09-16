package com.changuitostudio.backend.infrastructure.config;

import com.changuitostudio.backend.application.gateway.JwtProvider;
import com.changuitostudio.backend.application.gateway.UsuarioRepository;
import com.changuitostudio.backend.domain.model.Usuario;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    // No usa el prefijo __Host- para que el entorno local por HTTP pueda iniciar sesión.
    // En producción APP_AUTH_COOKIE_SECURE=true fuerza el atributo Secure.
    public static final String SESSION_COOKIE = "bosquejo_session";

    private final JwtProvider jwtProvider;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthFilter(JwtProvider jwtProvider, UsuarioRepository usuarioRepository) {
        this.jwtProvider = jwtProvider;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = tokenFromCookie(request);
        if (token == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) token = authHeader.substring(7);
        }

        if (token != null && jwtProvider.isAccessToken(token)) {
                String subject = jwtProvider.getSubjectFromToken(token);

                Usuario usuario = usuarioRepository.buscarPorId(Long.parseLong(subject)).orElse(null);
                if (usuario == null || !Boolean.TRUE.equals(usuario.getEstUsu())) {
                    filterChain.doFilter(request, response);
                    return;
                }
                if (!jwtProvider.matchesCredentialVersion(token, usuario.getPasUsu())) {
                    filterChain.doFilter(request, response);
                    return;
                }
                String authority = (Long.valueOf(1L).equals(usuario.getIdRol()) || Long.valueOf(5L).equals(usuario.getIdRol()))
                        ? "ROLE_ADMIN" : Long.valueOf(2L).equals(usuario.getIdRol()) ? "ROLE_EMPLOYEE" : "ROLE_USER";

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        subject,
                        null,
                    List.of(new SimpleGrantedAuthority(authority)));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        filterChain.doFilter(request, response);
    }

    private String tokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (SESSION_COOKIE.equals(cookie.getName())) return cookie.getValue();
        }
        return null;
    }
}

