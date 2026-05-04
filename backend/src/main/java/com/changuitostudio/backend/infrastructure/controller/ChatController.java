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
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ManageUsuarioUseCase manageUsuarioUseCase;
    private final RestTemplate restTemplate;

    public ChatController(ManageUsuarioUseCase manageUsuarioUseCase) {
        this.manageUsuarioUseCase = manageUsuarioUseCase;
        this.restTemplate = new RestTemplate();
    }

    @PostMapping("/message")
    public ResponseEntity<?> sendMessageToAI(@RequestBody ChatRequest request, HttpServletRequest httpServletRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String rol = "NO_REGISTRADO";
        Long userId = null;
        String nomUsu = "Visitante";

        // Extraemos el token original para que n8n pueda usarlo
        String authHeader = httpServletRequest.getHeader("Authorization");
        String token = (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;

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
                // El principal no era un ID numérico, ignoramos y queda como NO_REGISTRADO
            }
        }

        // Armamos el payload para n8n
        Map<String, Object> n8nPayload = new HashMap<>();
        n8nPayload.put("message", request.getMessage());
        n8nPayload.put("role", rol);
        n8nPayload.put("userId", userId);
        n8nPayload.put("userName", nomUsu);
        n8nPayload.put("token", token); // Pasamos el token a n8n

        // Llamada al webhook de n8n (Apunta a la IP de tu Máquina Virtual en
        // producción)
        String n8nWebhookUrl = "http://192.168.100.36:5678/webhook/chat-ia";

        try {
            // Se hace la petición POST a n8n
            ResponseEntity<Map> n8nResponse = restTemplate.postForEntity(n8nWebhookUrl, n8nPayload, Map.class);
            return ResponseEntity.ok(n8nResponse.getBody());
        } catch (Exception e) {
            // Si n8n no está corriendo, devolvemos un mensaje de prueba para que React no
            // falle
            Map<String, String> mockResponse = new HashMap<>();
            mockResponse.put("reply", "Hola, soy el asistente mock (" + rol + "). Recibí tu mensaje: '"
                    + request.getMessage() + "'. Para tener respuestas reales debes iniciar n8n.");
            return ResponseEntity.ok(mockResponse);
        }
    }
}
