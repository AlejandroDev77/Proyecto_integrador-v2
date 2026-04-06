package com.changuitostudio.backend.application.usecase;

/**
 * Caso de uso: Restablecer contraseÃ±a.
 */
public interface PasswordResetUseCase {

    /**
     * EnvÃ­a un email de restablecimiento de contraseÃ±a.
     * Siempre retorna sin error (no revela si el email existe).
     */
    void requestPasswordReset(String email);

    /**
     * Restablece la contraseÃ±a usando el token recibido por email.
     */
    void resetPassword(String token, String newPassword);
}

