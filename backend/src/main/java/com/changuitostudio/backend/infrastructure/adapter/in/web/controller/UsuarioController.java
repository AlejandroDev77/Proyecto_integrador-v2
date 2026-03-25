package com.changuitostudio.backend.infrastructure.adapter.in.web.controller;

import com.changuitostudio.backend.application.port.in.UsuarioServicePort;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.infrastructure.adapter.in.web.dto.UsuarioDTO.UsuarioRequestDTO;
import com.changuitostudio.backend.infrastructure.adapter.in.web.dto.UsuarioDTO.UsuarioResponseDTO;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Adaptador de ENTRADA — Controller REST para Usuarios.
 * Endpoints y formato de respuesta 100% compatibles con el backend Laravel.
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioServicePort usuarioServicePort;

    public UsuarioController(UsuarioServicePort usuarioServicePort) {
        this.usuarioServicePort = usuarioServicePort;
    }

    // ────────────────────────────────────────────────────────────
    // GET /api/usuarios (index con paginación y filtros)
    // ────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "per_page", required = false) Integer perPage,
            @RequestParam(value = "sort", required = false, defaultValue = "") String sort,
            @RequestParam Map<String, String> allParams) {

        // Extraer filtros: filter[search], filter[nom_usu], etc.
        Map<String, String> filters = new HashMap<>();
        allParams.forEach((key, value) -> {
            if (key.startsWith("filter[") && key.endsWith("]")) {
                String filterName = key.substring(7, key.length() - 1);
                filters.put(filterName, value);
            }
        });

        // Si no hay page ni per_page, devolver todos sin paginación (como hacía
        // Laravel)
        if (page == null && perPage == null) {
            Page<Usuario> allData = usuarioServicePort.listarUsuarios(1, Integer.MAX_VALUE, filters, sort);
            List<UsuarioResponseDTO> items = allData.getContent().stream()
                    .map(this::toResponse)
                    .toList();
            return ResponseEntity.ok(items);
        }

        int currentPage = (page != null) ? page : 1;
        int size = (perPage != null) ? perPage : 20;

        Page<Usuario> resultado = usuarioServicePort.listarUsuarios(currentPage, size, filters, sort);

        // Construir respuesta en formato EXACTO de Laravel Paginator
        Map<String, Object> response = new HashMap<>();
        response.put("current_page", resultado.getNumber() + 1);
        response.put("data", resultado.getContent().stream().map(this::toResponse).toList());
        response.put("first_page_url", "?page=1");
        response.put("from",
                resultado.getNumberOfElements() > 0 ? resultado.getNumber() * resultado.getSize() + 1 : null);
        response.put("last_page", resultado.getTotalPages());
        response.put("last_page_url", "?page=" + resultado.getTotalPages());
        response.put("next_page_url", resultado.hasNext() ? "?page=" + (resultado.getNumber() + 2) : null);
        response.put("path", "/api/usuarios");
        response.put("per_page", size);
        response.put("prev_page_url", resultado.hasPrevious() ? "?page=" + resultado.getNumber() : null);
        response.put("to",
                resultado.getNumberOfElements() > 0
                        ? resultado.getNumber() * resultado.getSize() + resultado.getNumberOfElements()
                        : null);
        response.put("total", resultado.getTotalElements());

        return ResponseEntity.ok(response);
    }

    // ────────────────────────────────────────────────────────────
    // GET /api/usuarios/{id} (show)
    // ────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> show(@PathVariable Long id) {
        return usuarioServicePort.obtenerPorId(id)
                .map(u -> ResponseEntity.ok(toResponse(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ────────────────────────────────────────────────────────────
    // POST /api/usuarios (store)
    // ────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> store(@Valid @RequestBody UsuarioRequestDTO request) {
        Usuario dominio = new Usuario();
        dominio.setNomUsu(request.getNomUsu());
        dominio.setEmailUsu(request.getEmailUsu());
        dominio.setPasUsu(request.getPasUsu());
        dominio.setEstUsu(request.getEstUsu());
        dominio.setIdRol(request.getIdRol());

        Usuario creado = usuarioServicePort.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(creado));
    }

    // ────────────────────────────────────────────────────────────
    // PUT /api/usuarios/{id} (update)
    // ────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> update(@PathVariable Long id,
            @RequestBody UsuarioRequestDTO request) {
        Usuario dominio = new Usuario();
        dominio.setNomUsu(request.getNomUsu());
        dominio.setEmailUsu(request.getEmailUsu());
        dominio.setPasUsu(request.getPasUsu());
        dominio.setEstUsu(request.getEstUsu());
        dominio.setIdRol(request.getIdRol());

        Usuario actualizado = usuarioServicePort.actualizar(id, dominio);
        return ResponseEntity.ok(toResponse(actualizado));
    }

    // ────────────────────────────────────────────────────────────
    // DELETE /api/usuarios/{id} (destroy)
    // ────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        usuarioServicePort.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ────────────────────────────────────────────────────────────
    // PUT /api/usuarios/{id}/estado (cambiar estado)
    // ────────────────────────────────────────────────────────────
    @PutMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponseDTO> cambiarEstado(@PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        // El frontend envía { est_usu: 0 } o { est_usu: 1 }
        Object estValue = body.get("est_usu");
        Boolean nuevoEstado;
        if (estValue instanceof Boolean) {
            nuevoEstado = (Boolean) estValue;
        } else if (estValue instanceof Number) {
            nuevoEstado = ((Number) estValue).intValue() == 1;
        } else {
            nuevoEstado = Boolean.parseBoolean(estValue.toString());
        }

        Usuario actualizado = usuarioServicePort.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(toResponse(actualizado));
    }

    // ── Helper: Domain → DTO ──────────────────────────────────

    private UsuarioResponseDTO toResponse(Usuario u) {
        return new UsuarioResponseDTO(
                u.getIdUsu(),
                u.getNomUsu(),
                u.getEmailUsu(),
                u.getEstUsu(),
                u.getCodUsu(),
                u.getIdRol(),
                u.getNomRol());
    }
}
