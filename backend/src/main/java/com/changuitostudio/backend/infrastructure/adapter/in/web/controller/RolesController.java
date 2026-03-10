package com.changuitostudio.backend.infrastructure.adapter.in.web.controller;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.RolJpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controller para Roles — CRUD + redirect-route.
 * Compatible con el formato de paginación Laravel.
 */
@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RolesController {

    private final RolJpaRepository rolRepository;

    // Mapeo de rutas por rol (idéntico a Laravel)
    private static final Map<Long, String> ROUTE_MAP = Map.of(
            1L, "/dashboard", // Administrador
            2L, "/negocio", // Empleado
            3L, "/products", // Cliente
            5L, "/dashboard");

    public RolesController(RolJpaRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    /**
     * GET /api/roles (index con paginación, compatible con Laravel paginator)
     */
    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "per_page", required = false) Integer perPage,
            @RequestParam(value = "sort", required = false, defaultValue = "") String sort,
            @RequestParam Map<String, String> allParams) {

        // Extraer filtro de nom_rol
        String nomRolFilter = null;
        for (Map.Entry<String, String> entry : allParams.entrySet()) {
            if (entry.getKey().equals("filter[nom_rol]")) {
                nomRolFilter = entry.getValue();
            }
        }

        // Si no hay paginación, devolver todo
        if (page == null && perPage == null) {
            List<RolEntity> allRoles = rolRepository.findAll();
            if (nomRolFilter != null && !nomRolFilter.isBlank()) {
                String filter = nomRolFilter.toLowerCase();
                allRoles = allRoles.stream()
                        .filter(r -> r.getNomRol().toLowerCase().contains(filter))
                        .toList();
            }
            return ResponseEntity.ok(allRoles.stream().map(this::toMap).toList());
        }

        int currentPage = (page != null) ? page : 1;
        int size = (perPage != null) ? perPage : 20;
        Pageable pageable = PageRequest.of(currentPage - 1, size);

        Page<RolEntity> resultado;
        if (nomRolFilter != null && !nomRolFilter.isBlank()) {
            String filter = nomRolFilter.toLowerCase();
            // Filtrar en memoria (para datasets pequeños como roles)
            List<RolEntity> all = rolRepository.findAll();
            List<RolEntity> filtered = all.stream()
                    .filter(r -> r.getNomRol().toLowerCase().contains(filter))
                    .toList();

            int start = Math.min((currentPage - 1) * size, filtered.size());
            int end = Math.min(start + size, filtered.size());
            List<RolEntity> pageContent = filtered.subList(start, end);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("current_page", currentPage);
            response.put("data", pageContent.stream().map(this::toMap).toList());
            response.put("last_page", (int) Math.ceil((double) filtered.size() / size));
            response.put("per_page", size);
            response.put("total", filtered.size());
            return ResponseEntity.ok(response);
        }

        resultado = rolRepository.findAll(pageable);

        // Formato Laravel paginator
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("current_page", resultado.getNumber() + 1);
        response.put("data", resultado.getContent().stream().map(this::toMap).toList());
        response.put("last_page", resultado.getTotalPages());
        response.put("per_page", size);
        response.put("total", resultado.getTotalElements());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/roles/{id_rol}/redirect-route
     */
    @GetMapping("/{id_rol}/redirect-route")
    public ResponseEntity<?> getRedirectRoute(@PathVariable Long id_rol) {
        var optRol = rolRepository.findById(id_rol);

        if (optRol.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Rol no encontrado"));
        }

        RolEntity rol = optRol.get();
        String route = ROUTE_MAP.getOrDefault(id_rol, "/signin");

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("route", route);
        resp.put("nom_rol", rol.getNomRol());

        return ResponseEntity.ok(resp);
    }

    // ── Helper ──

    private Map<String, Object> toMap(RolEntity rol) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id_rol", rol.getIdRol());
        map.put("nom_rol", rol.getNomRol());
        return map;
    }
}
