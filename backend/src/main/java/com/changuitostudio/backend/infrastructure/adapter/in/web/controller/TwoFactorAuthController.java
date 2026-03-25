package com.changuitostudio.backend.infrastructure.adapter.in.web.controller;

import com.changuitostudio.backend.application.service.TwoFactorAuthService;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.UsuarioJpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/2fa")
@CrossOrigin(origins = "*")
public class TwoFactorAuthController {

    private final TwoFactorAuthService twoFactorAuthService;
    private final UsuarioJpaRepository usuarioRepository;

    public TwoFactorAuthController(TwoFactorAuthService twoFactorAuthService, UsuarioJpaRepository usuarioRepository) {
        this.twoFactorAuthService = twoFactorAuthService;
        this.usuarioRepository = usuarioRepository;
    }

    // Helper method
    private Optional<UsuarioEntity> getAuthenticatedUser() {
        String principal = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            Long idUsu = Long.parseLong(principal);
            return usuarioRepository.findById(idUsu);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    // Obtener estado del 2FA
    @GetMapping("/status")
    public ResponseEntity<?> get2FAStatus() {
        Optional<UsuarioEntity> optUsuario = getAuthenticatedUser();

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuario no encontrado"));
        }

        UsuarioEntity usuario = optUsuario.get();
        return ResponseEntity.ok(Map.of("is_2fa_enabled", Boolean.TRUE.equals(usuario.getIs2faEnabled())));
    }

    // Generar o recuperar secreto y generar QR Code
    @PostMapping("/generate")
    public ResponseEntity<?> generateQRCode() {
        // Obtener ID o Username del JWT autenticado actual
        Optional<UsuarioEntity> optUsuario = getAuthenticatedUser();

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuario no encontrado"));
        }

        UsuarioEntity usuario = optUsuario.get();

        String secret;
        if (usuario.getSecret2fa() == null || usuario.getSecret2fa().isEmpty()) {
            secret = twoFactorAuthService.generateNewSecret();
            usuario.setSecret2fa(secret);
            // TODAVIA NO ACTIVAMOS HASTA VERIFICAR
            usuarioRepository.save(usuario);
        } else {
            secret = usuario.getSecret2fa();
        }

        // Generar la URL Base64 de la imagen QR
        String qrCodeImage = twoFactorAuthService.generateQrCodeImageUri(secret, usuario.getEmailUsu());

        return ResponseEntity.ok(Map.of(
                "qr_code_url", qrCodeImage,
                "secret", secret // Opcional enviarlo porsiacaso, o solo mostrar el QR
        ));
    }

    // Verificar el código PIN introducido para habilitar el 2FA
    @PostMapping("/verify-and-enable")
    public ResponseEntity<?> verifyAndEnable2FA(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        Optional<UsuarioEntity> optUsuario = getAuthenticatedUser();

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuario no encontrado"));
        }

        UsuarioEntity usuario = optUsuario.get();

        // Si ya está habilitado, devolver error (o éxito si así lo decides)
        if (Boolean.TRUE.equals(usuario.getIs2faEnabled())) {
            return ResponseEntity.badRequest().body(Map.of("message", "2FA ya está habilitado para esta cuenta."));
        }

        if (usuario.getSecret2fa() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Primero debes generar el código QR."));
        }

        boolean isValid = twoFactorAuthService.isOtpValid(usuario.getSecret2fa(), code);

        if (isValid) {
            usuario.setIs2faEnabled(true);
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(Map.of("message", "Autenticación de 2 Factores habilitada con éxito."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Código introducido incorrecto. Inténtalo de nuevo."));
        }
    }

    // Deshabilitar 2FA
    @PostMapping("/disable")
    public ResponseEntity<?> disable2FA() {
        Optional<UsuarioEntity> optUsuario = getAuthenticatedUser();

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuario no encontrado"));
        }

        UsuarioEntity usuario = optUsuario.get();
        usuario.setIs2faEnabled(false);
        usuario.setSecret2fa(null); // Eliminamos el secreto por seguridad, para que cuando lo reactive se genere uno nuevo
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("message", "La Autenticación de 2 Factores ha sido deshabilitada."));
    }
}
