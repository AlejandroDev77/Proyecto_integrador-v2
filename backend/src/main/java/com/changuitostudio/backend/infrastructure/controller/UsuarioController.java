package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageUsuarioUseCase;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.infrastructure.controller.dto.UsuarioDTO.UsuarioRequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.UsuarioDTO.UsuarioResponseDTO;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final ManageUsuarioUseCase manageUsuarioUseCase;

    public UsuarioController(ManageUsuarioUseCase manageUsuarioUseCase) {
        this.manageUsuarioUseCase = manageUsuarioUseCase;
    }

    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "per_page", required = false) Integer perPage,
            @RequestParam(value = "sort", required = false, defaultValue = "") String sort,
            @RequestParam Map<String, String> allParams) {

        Map<String, String> filters = new HashMap<>();
        allParams.forEach((key, value) -> {
            if (key.startsWith("filter[") && key.endsWith("]")) {
                String filterName = key.substring(7, key.length() - 1);
                filters.put(filterName, value);
            }
        });

        if (page == null && perPage == null) {
            PageResult<Usuario> allData = manageUsuarioUseCase.listarUsuarios(1, Integer.MAX_VALUE, filters, sort);
            List<UsuarioResponseDTO> items = allData.getContent().stream()
                    .map(this::toResponse)
                    .toList();
            return ResponseEntity.ok(items);
        }

        int currentPage = (page != null) ? page : 1;
        int size = (perPage != null) ? perPage : 20;

        PageResult<Usuario> resultado = manageUsuarioUseCase.listarUsuarios(currentPage, size, filters, sort);

        Map<String, Object> response = new HashMap<>();
        response.put("content", resultado.getContent().stream().map(this::toResponse).toList());
        response.put("page", resultado.getPage());
        response.put("size", resultado.getSize());
        response.put("totalElements", resultado.getTotalElements());
        response.put("totalPages", resultado.getTotalPages());
        response.put("hasNext", resultado.hasNext());
        response.put("hasPrevious", resultado.hasPrevious());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> show(@PathVariable Long id) {
        return manageUsuarioUseCase.obtenerPorId(id)
                .map(u -> ResponseEntity.ok(toResponse(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> store(@Valid @RequestBody UsuarioRequestDTO request) {
        Usuario dominio = new Usuario();
        dominio.setNomUsu(request.getNomUsu());
        dominio.setEmailUsu(request.getEmailUsu());
        dominio.setPasUsu(request.getPasUsu());
        dominio.setEstUsu(request.getEstUsu());
        dominio.setIdRol(request.getIdRol());

        Usuario creado = manageUsuarioUseCase.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> update(@PathVariable Long id,
            @RequestBody UsuarioRequestDTO request) {
        Usuario dominio = new Usuario();
        dominio.setNomUsu(request.getNomUsu());
        dominio.setEmailUsu(request.getEmailUsu());
        dominio.setPasUsu(request.getPasUsu());
        dominio.setEstUsu(request.getEstUsu());
        dominio.setIdRol(request.getIdRol());

        Usuario actualizado = manageUsuarioUseCase.actualizar(id, dominio);
        return ResponseEntity.ok(toResponse(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        manageUsuarioUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponseDTO> cambiarEstado(@PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Object estValue = body.get("est_usu");
        Boolean nuevoEstado;
        if (estValue instanceof Boolean) {
            nuevoEstado = (Boolean) estValue;
        } else if (estValue instanceof Number) {
            nuevoEstado = ((Number) estValue).intValue() == 1;
        } else {
            nuevoEstado = Boolean.parseBoolean(estValue.toString());
        }

        Usuario actualizado = manageUsuarioUseCase.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(toResponse(actualizado));
    }

    private UsuarioResponseDTO toResponse(Usuario u) {
        return new UsuarioResponseDTO(
                u.getIdUsu(), u.getNomUsu(), u.getEmailUsu(),
                u.getEstUsu(), u.getCodUsu(), u.getIdRol(), u.getNomRol());
    }
}

