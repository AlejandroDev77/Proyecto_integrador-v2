package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageRolUseCase;
import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.controller.dto.RolDTO.RolDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.RolDTO.RolRequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.RolDTO.RolResponseDTO;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controller REST para gestiÃ³n de roles.
 * Solo inyecta el Use Case ManageRolUseCase.
 */
@RestController
@RequestMapping("/api/roles")
public class RolesController {

    private final ManageRolUseCase manageRolUseCase;

    private static final Map<Long, String> ROUTE_MAP = Map.of(
            1L, "/dashboard",
            2L, "/negocio",
            3L, "/products",
            5L, "/dashboard");

    public RolesController(ManageRolUseCase manageRolUseCase) {
        this.manageRolUseCase = manageRolUseCase;
    }

    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer per_page,
            @RequestParam(required = false, defaultValue = "") String sort,
            @RequestParam Map<String, String> allParams) {

        Map<String, String> filters = new HashMap<>();
        allParams.forEach((key, value) -> {
            if (key.startsWith("filter[") && key.endsWith("]")) {
                String filterName = key.substring(7, key.length() - 1);
                filters.put(filterName, value);
            }
        });

        if (page == null && per_page == null) {
            PageResult<Rol> allData = manageRolUseCase.listarRoles(1, Integer.MAX_VALUE, filters, sort);
            return ResponseEntity.ok(allData.getContent().stream().map(this::toRolDTO).toList());
        }

        int currentPage = (page != null) ? page : 1;
        int size = (per_page != null) ? per_page : 20;

        PageResult<Rol> resultado = manageRolUseCase.listarRoles(currentPage, size, filters, sort);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", resultado.getContent().stream().map(this::toRolDTO).toList());
        response.put("page", resultado.getPage());
        response.put("size", resultado.getSize());
        response.put("totalElements", resultado.getTotalElements());
        response.put("totalPages", resultado.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id_rol}/redirect-route")
    public ResponseEntity<?> getRedirectRoute(@PathVariable Long id_rol) {
        Optional<Rol> optRol = manageRolUseCase.obtenerPorId(id_rol);
        if (optRol.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Rol no encontrado"));
        }
        Rol rol = optRol.get();
        String route = ROUTE_MAP.getOrDefault(id_rol, "/signin");
        return ResponseEntity.ok(Map.of("route", route, "nom_rol", rol.getNomRol()));
    }

    @GetMapping("/{id_rol}")
    public ResponseEntity<?> obtenerRol(@PathVariable Long id_rol) {
        Optional<Rol> optRol = manageRolUseCase.obtenerPorId(id_rol);
        if (optRol.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Rol no encontrado"));
        }
        return ResponseEntity.ok(toRolDTO(optRol.get()));
    }

    @PostMapping
    public ResponseEntity<RolResponseDTO> store(@Valid @RequestBody RolRequestDTO request) {
        Rol dominio = new Rol();
        dominio.setNomRol(request.getNom_rol());
        Rol creado = manageRolUseCase.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(creado));
    }

    @PutMapping("/{id_rol}")
    public ResponseEntity<RolResponseDTO> update(@PathVariable Long id_rol,
            @RequestBody RolRequestDTO request) {
        Rol dominio = new Rol();
        dominio.setNomRol(request.getNom_rol());
        Rol actualizado = manageRolUseCase.actualizar(id_rol, dominio);
        return ResponseEntity.ok(toResponseDTO(actualizado));
    }

    @DeleteMapping("/{id_rol}")
    public ResponseEntity<Void> destroy(@PathVariable Long id_rol) {
        manageRolUseCase.eliminar(id_rol);
        return ResponseEntity.noContent().build();
    }

    private RolDTO toRolDTO(Rol r) {
        var permisosDTO = r.getPermisos() != null
                ? r.getPermisos().stream()
                        .map(p -> new RolDTO.PermisoConPivotDTO(
                                p.getId(), p.getNomPermiso(), p.getDescripcion(), r.getId()))
                        .toList()
                : null;
        return new RolDTO(r.getId(), r.getNomRol(), permisosDTO);
    }

    private RolResponseDTO toResponseDTO(Rol u) {
        return new RolResponseDTO(u.getId(), u.getNomRol());
    }
}

