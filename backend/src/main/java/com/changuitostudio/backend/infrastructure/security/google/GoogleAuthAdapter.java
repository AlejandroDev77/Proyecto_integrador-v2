package com.changuitostudio.backend.infrastructure.security.google;

import com.changuitostudio.backend.application.gateway.GoogleAuthProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;

/**
 * Adaptador de salida â€” Implementa GoogleAuthProvider usando Google API Client.
 */
@Component
public class GoogleAuthAdapter implements GoogleAuthProvider {

    private final String googleClientId;

    public GoogleAuthAdapter(@Value("${oauth2.google.client-id}") String googleClientId) {
        this.googleClientId = googleClientId;
    }

    @Override
    public GoogleUserInfo verifyToken(String idTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new RuntimeException("El token de Google no es vÃ¡lido.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String nombre = (String) payload.get("nombre");
        String foto = (String) payload.get("foto");

        return new GoogleUserInfo(email, nombre, foto);
    }
}

