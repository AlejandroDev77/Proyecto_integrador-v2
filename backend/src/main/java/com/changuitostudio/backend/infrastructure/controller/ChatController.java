package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.ChatRequest;
import com.changuitostudio.backend.application.usecase.ManageUsuarioUseCase;
import com.changuitostudio.backend.domain.model.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ManageUsuarioUseCase manageUsuarioUseCase;
    private final RestTemplate restTemplate;
    private final String webhookUrl;

    public ChatController(ManageUsuarioUseCase manageUsuarioUseCase, RestTemplate restTemplate,
                          @Value("${app.chat.webhook-url}") String webhookUrl) {
        this.manageUsuarioUseCase = manageUsuarioUseCase;
        this.restTemplate = restTemplate;
        this.webhookUrl = webhookUrl;
    }

    @PostMapping("/message")
    public ResponseEntity<?> sendMessageToAI(@Valid @RequestBody ChatRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String rol = "USUARIO";
        Long userId = null;
        String nomUsu = "Usuario";

        // Verificamos si hay un usuario autenticado
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                String principal = authentication.getName();
                userId = Long.parseLong(principal);

                // Obtenemos los detalles del usuario desde la BD
                Optional<Usuario> usuarioOpt = manageUsuarioUseCase.obtenerPorId(userId);
                if (usuarioOpt.isPresent()) {
                    Usuario usuario = usuarioOpt.get();
                    nomUsu = usuario.getNomUsu();

                    // Asignamos el rol según los IDs de tu sistema (1 = Admin, 2 = Empleado)
                    if (usuario.getIdRol() != null) {
                        if (usuario.getIdRol() == 1L || usuario.getIdRol() == 5L) {
                            rol = "ADMINISTRADOR";
                        } else if (usuario.getIdRol() == 2L) {
                            rol = "EMPLEADO";
                        } else if (usuario.getIdRol() == 3L) {
                            rol = "CLIENTE";
                        }
                    } else if (usuario.getNomRol() != null) {
                        rol = usuario.getNomRol().toUpperCase();
                    }
                }
            } catch (NumberFormatException e) {
                // El principal no era un ID numérico, ignoramos y queda como GUEST
            }
        }

        // Armamos el payload para n8n
        Map<String, Object> n8nPayload = new HashMap<>();
        n8nPayload.put("message", request.getMessage());
        n8nPayload.put("role", rol);
        n8nPayload.put("userId", userId);
        n8nPayload.put("userName", nomUsu);

        // Llamada al webhook de n8n (Apunta a la IP de tu Máquina Virtual en
        // producción)
        try {
            // Se hace la petición POST a n8n
            ResponseEntity<Map> n8nResponse = restTemplate.postForEntity(webhookUrl, n8nPayload, Map.class);
            return ResponseEntity.ok(n8nResponse.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("message", "El asistente no está disponible temporalmente."));
        }
    }
}
