package com.changuitostudio.backend.application.usecase;

/**
 * Caso de uso: GestiÃ³n de autenticaciÃ³n de dos factores (2FA).
 */
public interface TwoFactorAuthUseCase {

    record TwoFactorSetupResult(String qrCodeUrl, String secret) {}

    /**
     * Verifica si el usuario tiene 2FA habilitado.
     */
    boolean is2faEnabled(Long userId);

    /**
     * Genera el secreto y QR code para configurar 2FA.
     */
    TwoFactorSetupResult generateSetup(Long userId);

    /**
     * Verifica el cÃ³digo OTP y habilita 2FA.
     */
    void verifyAndEnable(Long userId, String code);

    /**
     * Deshabilita 2FA para el usuario.
     */
    void disable(Long userId);
}

