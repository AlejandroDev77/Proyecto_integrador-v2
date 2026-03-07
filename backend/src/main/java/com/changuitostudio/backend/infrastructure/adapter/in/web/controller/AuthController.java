package com.changuitostudio.backend.infrastructure.adapter.in.web.controller;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.PermisoEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.UsuarioJpaRepository;
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

/**
 * Auth Controller — Login, Register, Me, Logout.
 * Respuestas 100% compatibles con el frontend existente.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioJpaRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioJpaRepository usuarioRepository, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    // ────────────────────────────────────────────────────────────
    // POST /api/login
    // ────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Buscar usuario por nom_usu
        Optional<UsuarioEntity> optUsuario = usuarioRepository.findByNomUsu(request.nom_usu);

        if (optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales incorrectas"));
        }

        UsuarioEntity usuario = optUsuario.get();

        // Validar password
        if (!passwordEncoder.matches(request.password, usuario.getPasUsu())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales incorrectas"));
        }

        // Obtener permisos del rol
        List<String> permisos = new ArrayList<>();
        if (usuario.getRol() != null && usuario.getRol().getPermisos() != null) {
            permisos = usuario.getRol().getPermisos().stream()
                    .map(PermisoEntity::getNombre)
                    .collect(Collectors.toList());
        }

        // Generar JWT con claims personalizados (idéntico a Laravel)
        String token = jwtUtil.generateToken(
                usuario.getIdUsu(),
                usuario.getIdRol(),
                usuario.getCodUsu(),
                permisos);

        // Respuesta en formato idéntico al Laravel
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Inicio de sesión exitoso");
        response.put("access_token", token);
        response.put("token_type", "bearer");
        response.put("expires_in", 86400000); // 24 horas en ms

        return ResponseEntity.ok(response);
    }

    // ────────────────────────────────────────────────────────────
    // POST /api/register
    // ────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Validar unicidad de nom_usu
        if (usuarioRepository.existsByNomUsu(request.nom_usu)) {
            return ResponseEntity.status(422)
                    .body(Map.of("errors", Map.of("nom_usu", List.of("El nombre de usuario ya está en uso."))));
        }

        // Validar unicidad de email_usu
        if (usuarioRepository.existsByEmailUsu(request.email_usu)) {
            return ResponseEntity.status(422)
                    .body(Map.of("errors", Map.of("email_usu", List.of("El email ya está en uso."))));
        }

        // Generar código automático (USU-1, USU-2, ...)
        int nextId = 1;
        String codigo;
        do {
            codigo = "USU-" + nextId;
            nextId++;
        } while (usuarioRepository.existsByCodUsu(codigo));

        // Crear usuario
        UsuarioEntity entity = new UsuarioEntity();
        entity.setCodUsu(codigo);
        entity.setNomUsu(request.nom_usu);
        entity.setEmailUsu(request.email_usu);
        entity.setPasUsu(passwordEncoder.encode(request.pas_usu));
        entity.setEstUsu(true); // Activo por defecto

        // Setear rol
        var rol = new com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity();
        rol.setIdRol(request.id_rol);
        entity.setRol(rol);

        usuarioRepository.save(entity);

        return ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente"));
    }

    // ────────────────────────────────────────────────────────────
    // GET /api/me (verificar token válido)
    // ────────────────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("valid", true));
    }

    // ────────────────────────────────────────────────────────────
    // POST /api/logout (invalidar token — stateless, solo respuesta)
    // ────────────────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT es stateless, no se invalida en el servidor.
        // El frontend elimina el token del localStorage.
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada correctamente."));
    }

    // ── DTOs internos ──────────────────────────────────────────

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
