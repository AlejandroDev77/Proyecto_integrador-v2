package com.changuitostudio.backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.application.interactor.*;
import com.changuitostudio.backend.application.usecase.*;
import com.changuitostudio.backend.infrastructure.security.SpringBCryptPasswordEncoder;

@Configuration
public class BeanConfig {

    @Bean
    public PasswordEncoderGateway passwordEncoderGateway() {
        return new SpringBCryptPasswordEncoder();
    }

    @Bean
    public TwoFactorAuthCoreService twoFactorAuthCoreService() {
        return new TwoFactorAuthCoreService();
    }

    @Bean
    public LoginUseCase loginUseCase(UsuarioRepository usuarioRepository,
                                     RolRepository rolRepository,
                                     JwtProvider jwtProvider,
                                     GoogleAuthProvider googleAuthProvider,
                                     TwoFactorAuthCoreService tfaCoreService,
                                     PasswordEncoderGateway passwordEncoder) {
        return new LoginService(usuarioRepository, rolRepository, jwtProvider, googleAuthProvider, tfaCoreService, passwordEncoder);
    }

    @Bean
    public RegisterUseCase registerUseCase(UsuarioRepository usuarioRepository, PasswordEncoderGateway passwordEncoder) {
        return new RegisterService(usuarioRepository, passwordEncoder);
    }

    @Bean
    public PasswordResetUseCase passwordResetUseCase(UsuarioRepository usuarioRepository,
                                                     TokenRepository tokenRepository,
                                                     EmailSender emailSender,
                                                     PasswordEncoderGateway passwordEncoder) {
        return new PasswordResetService(usuarioRepository, tokenRepository, emailSender, passwordEncoder);
    }

    @Bean
    public ManageUsuarioUseCase manageUsuarioUseCase(UsuarioRepository usuarioRepository, PasswordEncoderGateway passwordEncoder) {
        return new UsuarioService(usuarioRepository, passwordEncoder);
    }

    @Bean
    public ManageRolUseCase manageRolUseCase(RolRepository rolRepository) {
        return new RolService(rolRepository);
    }

    @Bean
    public TwoFactorAuthUseCase twoFactorAuthUseCase(UsuarioRepository usuarioRepository,
                                                     TwoFactorAuthCoreService tfaCoreService) {
        return new TwoFactorAuthServiceImpl(usuarioRepository, tfaCoreService);
    }
}

