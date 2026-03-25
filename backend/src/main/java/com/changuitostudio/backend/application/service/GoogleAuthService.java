package com.changuitostudio.backend.application.service;

//import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.RolJpaRepository;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.UsuarioJpaRepository;
import com.changuitostudio.backend.infrastructure.config.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleAuthService {

    private final String googleClientId;
    private final UsuarioJpaRepository usuarioRepository;
    private final RolJpaRepository rolRepository;
    private final JwtUtil jwtUtil;

    public GoogleAuthService(
            @Value("${oauth2.google.client-id}") String googleClientId,
            UsuarioJpaRepository usuarioRepository,
            RolJpaRepository rolRepository,
            JwtUtil jwtUtil) {
        this.googleClientId = googleClientId;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> authenticateWithGoogle(String idTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String nombre = (String) payload.get("nombre");
            String foto = (String) payload.get("foto");

            Optional<UsuarioEntity> optUsuario = usuarioRepository.findByEmailUsu(email);
            UsuarioEntity usuario;

            if (optUsuario.isPresent()) {
                // El usuario ya existe, iniciamos sesión normal
                usuario = optUsuario.get();
                if (!Boolean.TRUE.equals(usuario.getEstUsu())) {
                    throw new RuntimeException("Tu cuenta se encuentra deshabilitada.");
                }
            } else {
                // Nuevo usuario de Google, lo registramos automáticamente
                usuario = new UsuarioEntity();
                usuario.setNomUsu(email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 4));
                usuario.setEmailUsu(email);
                usuario.setPasUsu(""); // Contraseña vacía porque usa Google
                usuario.setEstUsu(true);
                // Extraer el nombre para cliente o usar solo nom_usu dependiente del diseño

                // Asignar rol por defecto (ej. Cliente si lo desean, asumimos ID 3 como rol
                // básico o buscar por nombre)
                Optional<RolEntity> clienteRol = rolRepository.findById(3L);
                if (clienteRol.isPresent()) {
                    usuario.setRol(clienteRol.get());
                }

                formatearCodigoGoogle(usuario, usuarioRepository.count() + 1);

                usuario = usuarioRepository.save(usuario);
            }

            // Generar JWT
            Long idRol = usuario.getRol() != null ? usuario.getRol().getIdRol() : 3L;
            java.util.List<String> permisos = usuario.getRol() != null && usuario.getRol().getPermisos() != null
                    ? usuario.getRol().getPermisos().stream().map(p -> p.getNombre()).toList()
                    : Collections.emptyList();

            if (Boolean.TRUE.equals(usuario.getIs2faEnabled())) {
                String tempToken = jwtUtil.generate2faTempToken(usuario.getIdUsu());
                Map<String, Object> resp2fa = new HashMap<>();
                resp2fa.put("requires_2fa", true);
                resp2fa.put("temp_token", tempToken);
                return resp2fa;
            }

            String token = jwtUtil.generateToken(usuario.getIdUsu(), idRol, usuario.getCodUsu(), usuario.getNomUsu(),
                    usuario.getEmailUsu(), permisos);

            Map<String, Object> response = new HashMap<>();
            response.put("access_token", token);
            return response;
        } else {
            throw new RuntimeException("El token de Google no es válido.");
        }
    }

    private void formatearCodigoGoogle(UsuarioEntity usuario, long numero) {
        String numFormateado = String.format("%04d", numero);
        usuario.setCodUsu("G-" + numFormateado);
    }
}
