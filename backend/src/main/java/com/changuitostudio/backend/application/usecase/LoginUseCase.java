package com.changuitostudio.backend.application.usecase;

//import java.util.List;


public interface LoginUseCase {

    /**
     * Resultado del login.
     */
    record LoginResult(
            String accessToken,
            boolean requires2fa,
            String tempToken
    ) {
        public static LoginResult success(String token) {
            return new LoginResult(token, false, null);
        }

        public static LoginResult requires2fa(String tempToken) {
            return new LoginResult(null, true, tempToken);
        }
    }

    /**
     * Login con credenciales usuario/password.
     */
    LoginResult login(String nombreUsuario, String password);

    /**
     * Login con token de Google OAuth2.
     */
    LoginResult loginWithGoogle(String googleIdToken);

    
    LoginResult verify2fa(String tempToken, String code);
}

