package com.changuitostudio.backend.infrastructure.adapter.in.web.controller;

import com.changuitostudio.backend.application.port.in.RolesServicePort;
import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.adapter.in.web.dto.RolDTO.RolDTO;
import com.changuitostudio.backend.infrastructure.adapter.in.web.dto.RolDTO.RolRequestDTO;
import com.changuitostudio.backend.infrastructure.adapter.in.web.dto.RolDTO.RolResponseDTO;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/roles")
public class RolesController {

    private final RolesServicePort rolServicePort;

    // Mapeo de rutas por rol
    private static final Map<Long, String> ROUTE_MAP = Map.of(
            1L, "/dashboard",
            2L, "/negocio",
            3L, "/products",
            5L, "/dashboard");

    public RolesController(RolesServicePort rolServicePort) {
        this.rolServicePort = rolServicePort;
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
            Page<Rol> allRolesPage = rolServicePort.listarRoles(1, Integer.MAX_VALUE, filters, sort);
            return ResponseEntity.ok(allRolesPage.getContent().stream().map(this::toRolDTO).toList());
        }

        int currentPage = (page != null) ? page : 1;
        int size = (per_page != null) ? per_page : 20;

        Page<Rol> resultado = rolServicePort.listarRoles(currentPage, size, filters, sort);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("current_page", resultado.getNumber() + 1);
        response.put("data", resultado.getContent().stream().map(this::toRolDTO).toList());
        response.put("last_page", resultado.getTotalPages());
        response.put("per_page", size);
        response.put("total", resultado.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id_rol}/redirect-route")
    public ResponseEntity<?> getRedirectRoute(@PathVariable Long id_rol) {
        Optional<Rol> optRol = rolServicePort.obtenerPorId(id_rol);
        if (optRol.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Rol no encontrado"));
        }
        Rol rol = optRol.get();
        String route = ROUTE_MAP.getOrDefault(id_rol, "/signin");
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("route", route);
        resp.put("nom_rol", rol.getNomRol());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id_rol}")
    public ResponseEntity<?> obtenerRol(@PathVariable Long id_rol) {
        Optional<Rol> optRol = rolServicePort.obtenerPorId(id_rol);
        if (optRol.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Rol no encontrado", "id_rol", id_rol));
        }
        return ResponseEntity.ok(toRolDTO(optRol.get()));
    }

    @PostMapping
    public ResponseEntity<RolResponseDTO> store(@Valid @RequestBody RolRequestDTO request) {
        Rol dominio = new Rol();
        dominio.setNomRol(request.getNom_rol());

        Rol creado = rolServicePort.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(creado));
    }

    @PutMapping("/{id_rol}")
    public ResponseEntity<RolResponseDTO> update(@PathVariable Long id_rol,
            @RequestBody RolRequestDTO request) {
        Rol dominio = new Rol();
        dominio.setNomRol(request.getNom_rol());

        Rol actualizado = rolServicePort.actualizar(id_rol, dominio);
        return ResponseEntity.ok(toResponseDTO(actualizado));
    }

    @DeleteMapping("/{id_rol}")
    public ResponseEntity<Void> destroy(@PathVariable Long id_rol) {
        rolServicePort.eliminar(id_rol);
        return ResponseEntity.noContent().build();
    }

    private RolDTO toRolDTO(Rol r) {
        var permisosDTO = r.getPermisos() != null
                ? r.getPermisos().stream()
                .map(p -> new RolDTO.PermisoConPivotDTO(
                        p.getId(),
                        p.getNombre(),
                        p.getDescripcion(),
                        r.getId()
                )).toList()
                : null;
        return new RolDTO(r.getId(), r.getNomRol(), permisosDTO);
    }

    private RolResponseDTO toResponseDTO(Rol u) {
        return new RolResponseDTO(
                u.getId(),
                u.getNomRol());
    }
}
