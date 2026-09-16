package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.usecase.PasswordResetUseCase;
import com.changuitostudio.backend.application.gateway.EmailSender;
import com.changuitostudio.backend.application.gateway.TokenRepository;
import com.changuitostudio.backend.application.gateway.UsuarioRepository;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.application.gateway.PasswordEncoderGateway;



import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

public class PasswordResetService implements PasswordResetUseCase {

    private final UsuarioRepository usuarioRepository;
    private final TokenRepository tokenRepository;
    private final EmailSender emailSender;
    private final PasswordEncoderGateway passwordEncoder;
    private final String frontendUrl;

    public PasswordResetService(UsuarioRepository usuarioRepository,
                                TokenRepository tokenRepository,
                                EmailSender emailSender,
                                PasswordEncoderGateway passwordEncoder,
                                String frontendUrl) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.emailSender = emailSender;
        this.passwordEncoder = passwordEncoder;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void requestPasswordReset(String email) {
        if (email == null || email.isBlank()) return;
        usuarioRepository.buscarPorEmail(email).ifPresent(usuario -> {
            String token = UUID.randomUUID().toString();
            tokenRepository.guardarToken(token, usuario.getIdUsu(), "PASSWORD_RESET", 1);

            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            String mensaje = "Hola " + usuario.getNomUsu() + ",\n\n" +
                    "Recibimos una solicitud para restablecer tu contraseÃƒÂ±a. Haz clic en el siguiente enlace:\n" +
                    resetUrl + "\n\n" +
                    "Si no fuiste tÃƒÂº, ignora este correo.\n\n" +
                    "Equipo de Bosquejo.";

            emailSender.sendEmail(email, "Restablece tu contraseÃƒÂ±a - Bosquejo", mensaje);
        });
        // Siempre retorna sin error (no revela si el email existe)
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        if (newPassword == null || newPassword.length() < 12 || newPassword.length() > 72) {
            throw new IllegalArgumentException("La contraseña debe tener entre 12 y 72 caracteres.");
        }
        TokenRepository.TokenData tokenData = tokenRepository.buscarPorToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token invÃƒÂ¡lido o expirado."));

        if (tokenData.expired() || !"PASSWORD_RESET".equals(tokenData.tokenType())) {
            throw new IllegalArgumentException("Token invÃƒÂ¡lido o expirado.");
        }

        Usuario usuario = usuarioRepository.buscarPorId(tokenData.usuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        usuario.setPasUsu(passwordEncoder.encode(newPassword));
        usuarioRepository.guardar(usuario);

        tokenRepository.eliminarToken(token);
    }
}



