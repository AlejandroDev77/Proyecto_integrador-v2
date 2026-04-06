package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.usecase.LoginUseCase;
import com.changuitostudio.backend.application.usecase.PasswordResetUseCase;
import com.changuitostudio.backend.application.usecase.RegisterUseCase;
import com.changuitostudio.backend.domain.exception.CredencialesInvalidasException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller de autenticaciÃ³n.
 * Solo inyecta Use Cases (puertos de entrada), nunca repositorios JPA.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;
    private final PasswordResetUseCase passwordResetUseCase;

    public AuthController(LoginUseCase loginUseCase,
                          RegisterUseCase registerUseCase,
                          PasswordResetUseCase passwordResetUseCase) {
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.passwordResetUseCase = passwordResetUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
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
            registerUseCase.register(request.nomUsu, request.emailUsu, request.pasUsu, request.idRol);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Usuario registrado correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("valid", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "SesiÃ³n cerrada correctamente."));
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

    // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private ResponseEntity<?> buildLoginResponse(LoginUseCase.LoginResult result) {
        Map<String, Object> response = new LinkedHashMap<>();

        if (result.requires2fa()) {
            response.put("requires_2fa", true);
            response.put("temp_token", result.tempToken());
            response.put("message", "AutenticaciÃ³n de 2 Factores requerida.");
            return ResponseEntity.ok(response);
        }

        response.put("message", "Inicio de sesiÃ³n exitoso");
        response.put("access_token", result.accessToken());
        response.put("token_type", "bearer");
        response.put("expires_in", 86400000);
        return ResponseEntity.ok(response);
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
        @Size(min = 6, message = "La contraseÃ±a debe tener al menos 6 caracteres.")
        public String pasUsu;

        @NotNull(message = "El rol es obligatorio.")
        public Long idRol;
    }
}

