package com.changuitostudio.backend.infrastructure.adapter.in.web.controller;

import com.changuitostudio.backend.application.port.in.RolesServicePort;
import com.changuitostudio.backend.application.port.in.UsuarioServicePort;
import com.changuitostudio.backend.domain.model.Permiso;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.infrastructure.config.JwtUtil;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


import com.changuitostudio.backend.application.service.EmailService;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.VerificationTokenEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.UsuarioJpaRepository;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.VerificationTokenJpaRepository;
import com.changuitostudio.backend.application.service.GoogleAuthService;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioServicePort usuarioServicePort;
    private final RolesServicePort rolesServicePort;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Inyecciones para recuperación de contraseña
    private final EmailService emailService;
    private final UsuarioJpaRepository usuarioJpaRepository;
    private final VerificationTokenJpaRepository tokenRepository;
    private final GoogleAuthService googleAuthService;

    public AuthController(UsuarioServicePort usuarioServicePort, RolesServicePort rolesServicePort, JwtUtil jwtUtil, 
                          EmailService emailService, UsuarioJpaRepository usuarioJpaRepository, VerificationTokenJpaRepository tokenRepository,
                          GoogleAuthService googleAuthService) {
        this.usuarioServicePort = usuarioServicePort;
        this.rolesServicePort = rolesServicePort;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.usuarioJpaRepository = usuarioJpaRepository;
        this.tokenRepository = tokenRepository;
        this.googleAuthService = googleAuthService;
    }

   
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Buscar usuario por nom_usu a través del puerto
        Optional<Usuario> optUsuario = usuarioServicePort.obtenerPorNombre(request.nom_usu);

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales incorrectas"));
        }

        Usuario usuario = optUsuario.get();

        // Validar password
        if (!passwordEncoder.matches(request.password, usuario.getPasUsu())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales incorrectas"));
        }

        // Obtener permisos del rol llamando al servicio de roles
        List<String> permisos = new ArrayList<>();
        if (usuario.getIdRol() != null) {
            rolesServicePort.obtenerPorId(usuario.getIdRol()).ifPresent(rol -> {
                if (rol.getPermisos() != null) {
                    permisos.addAll(rol.getPermisos().stream()
                            .map(Permiso::getNombre)
                            .collect(Collectors.toList()));
                }
            });
        }

        // Si tiene 2FA activado, detener el flujo y pedir el código
        if (Boolean.TRUE.equals(usuario.getIs2faEnabled())) {
            String tempToken = jwtUtil.generate2faTempToken(usuario.getIdUsu());
            return ResponseEntity.ok(Map.of(
                "requires_2fa", true,
                "temp_token", tempToken,
                "message", "Autenticación de 2 Factores requerida."
            ));
        }

        // Generar JWT con claims personalizados
        String token = jwtUtil.generateToken(
                usuario.getIdUsu(),
                usuario.getIdRol(),
                usuario.getCodUsu(),
                usuario.getNomUsu(),
                usuario.getEmailUsu(),
                permisos);

        // Respuesta en formato idéntico al Laravel
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Inicio de sesión exitoso");
        response.put("access_token", token);
        response.put("token_type", "bearer");
        response.put("expires_in", 86400000); // 24 horas en ms

        return ResponseEntity.ok(response);
    }

   
    @PostMapping("/login/2fa")
    public ResponseEntity<?> loginWith2fa(@RequestBody Map<String, String> request) {
        String tempToken = request.get("temp_token");
        String code = request.get("code");

        if (tempToken == null || code == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Token temporal y código son requeridos."));
        }

        if (!jwtUtil.validateToken(tempToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token temporal inválido o expirado."));
        }

        Long idUsu = Long.parseLong(jwtUtil.getSubjectFromToken(tempToken));
        Optional<Usuario> optUsuario = usuarioServicePort.obtenerPorId(idUsu);

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = optUsuario.get();

        // Verificar el código 2FA
        com.changuitostudio.backend.application.service.TwoFactorAuthService tfaService = new com.changuitostudio.backend.application.service.TwoFactorAuthService();
        if (!tfaService.isOtpValid(usuario.getSecret2fa(), code)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Código 2FA incorrecto."));
        }

        // Obtener permisos del rol llamando al servicio de roles
        List<String> permisos = new ArrayList<>();
        if (usuario.getIdRol() != null) {
            rolesServicePort.obtenerPorId(usuario.getIdRol()).ifPresent(rol -> {
                if (rol.getPermisos() != null) {
                    permisos.addAll(rol.getPermisos().stream()
                            .map(Permiso::getNombre)
                            .collect(Collectors.toList()));
                }
            });
        }

        // Generar JWT REAL
        String token = jwtUtil.generateToken(
                usuario.getIdUsu(),
                usuario.getIdRol(),
                usuario.getCodUsu(),
                usuario.getNomUsu(),
                usuario.getEmailUsu(),
                permisos);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Inicio de sesión exitoso");
        response.put("access_token", token);
        response.put("token_type", "bearer");
        response.put("expires_in", 86400000); // 24 horas en ms

        return ResponseEntity.ok(response);
    }


    @PostMapping("/login/oauth2/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
        String idToken = request.get("credential");
        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "El token de Google es requerido."));
        }

        try {
            Map<String, Object> response = googleAuthService.authenticateWithGoogle(idToken);
            
            // Si retorna un 2FA temporal 
            if (response.containsKey("requires_2fa")) {
                response.put("message", "Autenticación de 2 Factores requerida.");
                return ResponseEntity.ok(response);
            }

            // Mapeamos a la respuesta tradicional compatible con el resto del Frontend
            response.put("message", "Inicio de sesión con Google exitoso");
            response.put("token_type", "bearer");
            response.put("expires_in", 86400000); // 24 horas

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No se pudo verificar el token de Google: " + e.getMessage()));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Validar unicidad de nom_usu
        if (usuarioServicePort.existePorNomUsu(request.nom_usu)) {
            return ResponseEntity.status(422)
                    .body(Map.of("errors", Map.of("nom_usu", List.of("El nombre de usuario ya está en uso."))));
        }

        // Validar unicidad de email_usu
        if (usuarioServicePort.existePorEmail(request.email_usu)) {
            return ResponseEntity.status(422)
                    .body(Map.of("errors", Map.of("email_usu", List.of("El email ya está en uso."))));
        }

   
        Usuario dominio = new Usuario();
        dominio.setNomUsu(request.nom_usu);
        dominio.setEmailUsu(request.email_usu);
        dominio.setPasUsu(request.pas_usu); 
        dominio.setEstUsu(true); 
        dominio.setIdRol(request.id_rol);

        usuarioServicePort.crear(dominio);

        return ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("valid", true));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT es stateless, no se invalida en el servidor.
        // El frontend elimina el token del localStorage.
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada correctamente."));
    }

 
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<UsuarioEntity> optUsuario = usuarioJpaRepository.findByEmailUsu(email);

        if (optUsuario.isPresent()) {
            UsuarioEntity usuario = optUsuario.get();
            String token = UUID.randomUUID().toString();

            // Guardar token expira en 1 hora
            VerificationTokenEntity myToken = new VerificationTokenEntity(
                    token, usuario, LocalDateTime.now().plusHours(1), "PASSWORD_RESET");
            tokenRepository.save(myToken);

            // Enviar correo
            String resetUrl = "http://localhost:5173/reset-password?token=" + token;
            String mensaje = "Hola " + usuario.getNomUsu() + ",\n\n" +
                    "Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace:\n" +
                    resetUrl + "\n\n" +
                    "Si no fuiste tú, ignora este correo.\n\n" +
                    "Equipo de Bosquejo.";

            emailService.sendEmail(email, "Restablece tu contraseña - Bosquejo", mensaje);
        }

        // Siempre devolver 200 
        return ResponseEntity.ok(Map.of("message", "Si el correo existe, recibirás instrucciones para restablecer tu contraseña."));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        Optional<VerificationTokenEntity> optToken = tokenRepository.findByToken(token);

        if (optToken.isEmpty() || optToken.get().isExpired() || !optToken.get().getTokenType().equals("PASSWORD_RESET")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Token inválido o expirado."));
        }

        VerificationTokenEntity tokenEntity = optToken.get();
        UsuarioEntity usuario = tokenEntity.getUsuario();

       
        usuario.setPasUsu(passwordEncoder.encode(newPassword));
        usuarioJpaRepository.save(usuario);

     
        tokenRepository.delete(tokenEntity);

        return ResponseEntity.ok(Map.of("message", "Contraseña restablecida con éxito."));
    }

  

    public static class LoginRequest {
        public String nom_usu;
        public String password;
    }

    public static class RegisterRequest {
        @NotBlank(message = "El nombre de usuario es obligatorio.")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres.")
        public String nom_usu;

        @NotBlank(message = "El correo electrónico es obligatorio.")
        @Email(message = "El correo electrónico debe ser válido.")
        public String email_usu;

        @NotBlank(message = "La contraseña es obligatoria.")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.")
        public String pas_usu;

        @NotNull(message = "El rol es obligatorio.")
        public Long id_rol;
    }
}
