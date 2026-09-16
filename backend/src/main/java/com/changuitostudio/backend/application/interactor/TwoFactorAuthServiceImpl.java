package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.usecase.TwoFactorAuthUseCase;
import com.changuitostudio.backend.application.gateway.UsuarioRepository;
import com.changuitostudio.backend.domain.exception.UsuarioNoEncontradoException;
import com.changuitostudio.backend.domain.model.Usuario;


public class TwoFactorAuthServiceImpl implements TwoFactorAuthUseCase {

    private final UsuarioRepository usuarioRepository;
    private final TwoFactorAuthCoreService tfaCoreService;

    public TwoFactorAuthServiceImpl(UsuarioRepository usuarioRepository,
                                     TwoFactorAuthCoreService tfaCoreService) {
        this.usuarioRepository = usuarioRepository;
        this.tfaCoreService = tfaCoreService;
    }

    @Override
    public boolean is2faEnabled(Long userId) {
        Usuario usuario = usuarioRepository.buscarPorId(userId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(userId));
        return Boolean.TRUE.equals(usuario.getIs2faEnabled());
    }

    @Override
    public TwoFactorSetupResult generateSetup(Long userId) {
        Usuario usuario = usuarioRepository.buscarPorId(userId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(userId));

        if (Boolean.TRUE.equals(usuario.getIs2faEnabled())) {
            throw new IllegalStateException("2FA ya está habilitado para esta cuenta.");
        }
        String secret = tfaCoreService.generateNewSecret();
        usuario.setSecret2fa(secret);
        usuarioRepository.guardar(usuario);

        String qrCodeUrl = tfaCoreService.generateQrCodeImageUri(secret, usuario.getEmailUsu());
        return new TwoFactorSetupResult(qrCodeUrl, secret);
    }

    @Override
    public void verifyAndEnable(Long userId, String code) {
        Usuario usuario = usuarioRepository.buscarPorId(userId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(userId));

        if (Boolean.TRUE.equals(usuario.getIs2faEnabled())) {
            throw new IllegalStateException("2FA ya estÃ¡ habilitado para esta cuenta.");
        }

        if (usuario.getSecret2fa() == null) {
            throw new IllegalStateException("Primero debes generar el cÃ³digo QR.");
        }

        if (!tfaCoreService.isOtpValid(usuario.getSecret2fa(), code)) {
            throw new IllegalArgumentException("CÃ³digo introducido incorrecto. IntÃ©ntalo de nuevo.");
        }

        usuario.setIs2faEnabled(true);
        usuarioRepository.guardar(usuario);
    }

    @Override
    public void disable(Long userId, String code) {
        Usuario usuario = usuarioRepository.buscarPorId(userId)
                .orElseThrow(() -> new UsuarioNoEncontradoException(userId));

        if (!Boolean.TRUE.equals(usuario.getIs2faEnabled()) || usuario.getSecret2fa() == null) {
            throw new IllegalStateException("2FA no está habilitado.");
        }
        if (!tfaCoreService.isOtpValid(usuario.getSecret2fa(), code)) {
            throw new IllegalArgumentException("Código 2FA incorrecto.");
        }

        usuario.setIs2faEnabled(false);
        usuario.setSecret2fa(null);
        usuarioRepository.guardar(usuario);
    }
}


