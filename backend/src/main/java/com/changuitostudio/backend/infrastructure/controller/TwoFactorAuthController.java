package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.usecase.TwoFactorAuthUseCase;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Controller REST para 2FA.
 * Solo inyecta el Use Case TwoFactorAuthUseCase, nunca repositorios JPA.
 */
@RestController
@RequestMapping("/api/2fa")
public class TwoFactorAuthController {

    private final TwoFactorAuthUseCase twoFactorAuthUseCase;

    public TwoFactorAuthController(TwoFactorAuthUseCase twoFactorAuthUseCase) {
        this.twoFactorAuthUseCase = twoFactorAuthUseCase;
    }

    @GetMapping("/status")
    public ResponseEntity<?> get2FAStatus() {
        Optional<Long> userId = getAuthenticatedUserId();
        if (userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario no encontrado"));
        }

        boolean enabled = twoFactorAuthUseCase.is2faEnabled(userId.get());
        return ResponseEntity.ok(Map.of("is_2fa_enabled", enabled));
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQRCode() {
        Optional<Long> userId = getAuthenticatedUserId();
        if (userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario no encontrado"));
        }

        TwoFactorAuthUseCase.TwoFactorSetupResult result = twoFactorAuthUseCase.generateSetup(userId.get());
        return ResponseEntity.ok(Map.of(
                "qr_code_url", result.qrCodeUrl(),
                "secret", result.secret()));
    }

    @PostMapping("/verify-and-enable")
    public ResponseEntity<?> verifyAndEnable2FA(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        Optional<Long> userId = getAuthenticatedUserId();

        if (userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario no encontrado"));
        }

        try {
            twoFactorAuthUseCase.verifyAndEnable(userId.get(), code);
            return ResponseEntity.ok(Map.of("message", "AutenticaciÃ³n de 2 Factores habilitada con Ã©xito."));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/disable")
    public ResponseEntity<?> disable2FA(@RequestBody Map<String, String> request) {
        Optional<Long> userId = getAuthenticatedUserId();
        if (userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario no encontrado"));
        }

        try {
            twoFactorAuthUseCase.disable(userId.get(), request.get("code"));
            return ResponseEntity.ok(Map.of("message", "La Autenticación de 2 Factores ha sido deshabilitada."));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private Optional<Long> getAuthenticatedUserId() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) return Optional.empty();
        String principal = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return Optional.of(Long.parseLong(principal));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }
}

