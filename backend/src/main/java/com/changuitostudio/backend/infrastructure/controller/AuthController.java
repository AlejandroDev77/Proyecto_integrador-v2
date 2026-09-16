package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.usecase.LoginUseCase;
import com.changuitostudio.backend.application.usecase.PasswordResetUseCase;
import com.changuitostudio.backend.application.usecase.RegisterUseCase;
import com.changuitostudio.backend.domain.exception.CredencialesInvalidasException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import jakarta.servlet.http.HttpServletRequest;
import com.changuitostudio.backend.application.gateway.JwtProvider;
import com.changuitostudio.backend.infrastructure.config.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.Cookie;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller de autenticaciÃ³n.
 * Solo inyecta Use Cases (puertos de entrada), nunca repositorios JPA.
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;
    private final PasswordResetUseCase passwordResetUseCase;
    private final JwtProvider jwtProvider;
    private final boolean secureCookie;

    public AuthController(LoginUseCase loginUseCase,
                          RegisterUseCase registerUseCase,
                          PasswordResetUseCase passwordResetUseCase, JwtProvider jwtProvider,
                          @Value("${app.auth.cookie-secure:false}") boolean secureCookie) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.passwordResetUseCase = passwordResetUseCase;
        this.jwtProvider = jwtProvider;
        this.secureCookie = secureCookie;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginUseCase.LoginResult result = loginUseCase.login(request.nomUsu, request.password);
            return buildLoginResponse(result);
        } catch (CredencialesInvalidasException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login/2fa")
    public ResponseEntity<?> loginWith2fa(@RequestBody Map<String, String> request) {
        String tempToken = request.get("temp_token");
        String code = request.get("code");

        if (tempToken == null || code == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Token temporal y cÃ³digo son requeridos."));
        }

        try {
            LoginUseCase.LoginResult result = loginUseCase.verify2fa(tempToken, code);
            return buildLoginResponse(result);
        } catch (CredencialesInvalidasException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login/oauth2/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
        String idToken = request.get("credential");
        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "El token de Google es requerido."));
        }

        try {
            LoginUseCase.LoginResult result = loginUseCase.loginWithGoogle(idToken);
            return buildLoginResponse(result);
        } catch (CredencialesInvalidasException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            registerUseCase.register(request.nomUsu, request.emailUsu, request.pasUsu);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuario registrado correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication, HttpServletRequest request) {
        String token = sessionToken(request);
        return ResponseEntity.ok(Map.of(
                "valid", true,
                "id_usu", Long.parseLong(authentication.getName()),
                "id_rol", jwtProvider.getRoleIdFromToken(token),
                "permisos", jwtProvider.getPermissionsFromToken(token)));
    }

    /** La ruta se decide con el rol de la sesión validada, nunca con un id enviado por el cliente. */
    @GetMapping("/me/redirect-route")
    public ResponseEntity<?> redirectRoute(HttpServletRequest request) {
        Long roleId = jwtProvider.getRoleIdFromToken(sessionToken(request));
        String route = switch (roleId.intValue()) {
            case 1, 5 -> "/dashboard";
            case 2 -> "/negocio";
            case 3 -> "/products";
            default -> "/signin";
        };
        return ResponseEntity.ok(Map.of("route", route));
    }

    /** Fuerza la emisión de la cookie XSRF-TOKEN legible por el cliente. */
    @GetMapping("/csrf")
    public ResponseEntity<?> csrf(org.springframework.security.web.csrf.CsrfToken token) {
        return ResponseEntity.ok(Map.of("headerName", token.getHeaderName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = sessionToken(request);
        if (token != null) jwtProvider.revokeToken(token);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredSessionCookie().toString())
                .body(Map.of("message", "SesiÃ³n cerrada correctamente."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        passwordResetUseCase.requestPasswordReset(email);
        return ResponseEntity.ok(Map.of("message",
                "Si el correo existe, recibirÃ¡s instrucciones para restablecer tu contraseÃ±a."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        try {
            passwordResetUseCase.resetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "ContraseÃ±a restablecida con Ã©xito."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    

    private ResponseEntity<?> buildLoginResponse(LoginUseCase.LoginResult result) {
        Map<String, Object> response = new LinkedHashMap<>();

        if (result.requires2fa()) {
            response.put("requires_2fa", true);
            response.put("temp_token", result.tempToken());
            response.put("message", "AutenticaciÃ³n de 2 Factores requerida.");
            return ResponseEntity.ok(response);
        }

        response.put("message", "Inicio de sesiÃ³n exitoso");
        response.put("user", Map.of(
                "id_usu", Long.parseLong(jwtProvider.getSubjectFromToken(result.accessToken())),
                "id_rol", jwtProvider.getRoleIdFromToken(result.accessToken()),
                "permisos", jwtProvider.getPermissionsFromToken(result.accessToken())));
        response.put("expires_in", 3600);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookie(result.accessToken()).toString())
                .body(response);
    }

    private ResponseCookie sessionCookie(String token) {
        return ResponseCookie.from(JwtAuthFilter.SESSION_COOKIE, token)
                .httpOnly(true).secure(secureCookie).sameSite("Strict").path("/").maxAge(3600).build();
    }

    private ResponseCookie expiredSessionCookie() {
        return ResponseCookie.from(JwtAuthFilter.SESSION_COOKIE, "")
                .httpOnly(true).secure(secureCookie).sameSite("Strict").path("/").maxAge(0).build();
    }

    private String sessionToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) for (Cookie cookie : cookies) {
            if (JwtAuthFilter.SESSION_COOKIE.equals(cookie.getName())) return cookie.getValue();
        }
        String header = request.getHeader("Authorization");
        return header != null && header.startsWith("Bearer ") ? header.substring(7) : null;
    }

    // â”€â”€ Request DTOs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public static class LoginRequest {
        @NotBlank(message = "El nombre de usuario es obligatorio.")
        public String nomUsu;
        @NotBlank(message = "La contraseÃ±a es obligatoria.")
        public String password;
    }

    public static class RegisterRequest {
        @NotBlank(message = "El nombre de usuario es obligatorio.")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres.")
        public String nomUsu;

        @NotBlank(message = "El correo electrÃ³nico es obligatorio.")
        @Email(message = "El correo electrÃ³nico debe ser vÃ¡lido.")
        public String emailUsu;

        @NotBlank(message = "La contraseÃ±a es obligatoria.")
        @Size(min = 12, max = 72, message = "La contraseña debe tener entre 12 y 72 caracteres.")
        public String pasUsu;
    }
}

