package com.changuitostudio.backend.infrastructure.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles-permisos")
public class RolPermisoController {

    private final JdbcTemplate jdbcTemplate;

    public RolPermisoController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer per_page) {

        int offset = (page - 1) * per_page;

        // Note: Assuming table is rol_permiso, with id, id_rol, id_permiso
        String countSql = "SELECT count(*) FROM rol_permiso";
        Integer total = jdbcTemplate.queryForObject(countSql, Integer.class);
        if (total == null) total = 0;

        String query = "SELECT rp.id_rol_permiso, rp.id_rol, r.nom_rol, rp.id_permiso, p.nombre AS nom_permiso, p.descripcion " +
                "FROM rol_permiso rp " +
                "JOIN roles r ON rp.id_rol = r.id_rol " +
                "JOIN permisos p ON rp.id_permiso = p.id_permiso " +
                "ORDER BY rp.id_rol_permiso DESC LIMIT ? OFFSET ?";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(query, per_page, offset);

        // Convert to expected JSON format
        List<Map<String, Object>> content = rows.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row.get("id_rol_permiso"));
            map.put("id_rol", row.get("id_rol"));
            map.put("id_permiso", row.get("id_permiso"));

            Map<String, Object> rol = new HashMap<>();
            rol.put("id_rol", row.get("id_rol"));
            rol.put("nom_rol", row.get("nom_rol"));
            map.put("rol", rol);

            Map<String, Object> permiso = new HashMap<>();
            permiso.put("id_permiso", row.get("id_permiso"));
            permiso.put("nom_permiso", row.get("nom_permiso"));
            permiso.put("descripcion", row.get("descripcion"));
            map.put("permiso", permiso);

            return map;
        }).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("page", page);
        response.put("size", per_page);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / per_page));

        // Format exactly like the others: { success: true, data: { content: [...] } }
        Map<String, Object> apiResponse = new HashMap<>();
        apiResponse.put("success", true);
        apiResponse.put("message", "Operación exitosa");
        apiResponse.put("data", response);

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody Map<String, Object> payload) {
        Long idRol = ((Number) payload.get("id_rol")).longValue();
        Long idPermiso = ((Number) payload.get("id_permiso")).longValue();

        // Check if exists
        String checkSql = "SELECT count(*) FROM rol_permiso WHERE id_rol = ? AND id_permiso = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, idRol, idPermiso);
        
        if (count != null && count > 0) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "El rol ya tiene este permiso");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        try {
            jdbcTemplate.execute("SELECT setval('rol_permiso_id_rol_permiso_seq', COALESCE((SELECT MAX(id_rol_permiso)+1 FROM rol_permiso), 1), false)");
        } catch (Exception e) {
            // Ignorar si la secuencia no existe o falla
        }

        String insertSql = "INSERT INTO rol_permiso (id_rol, id_permiso) VALUES (?, ?) RETURNING id_rol_permiso";
        Long id = jdbcTemplate.queryForObject(insertSql, Long.class, idRol, idPermiso);

        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("id_rol", idRol);
        result.put("id_permiso", idPermiso);

        Map<String, Object> apiResponse = new HashMap<>();
        apiResponse.put("success", true);
        apiResponse.put("message", "Asignación creada exitosamente");
        apiResponse.put("data", result);

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        String deleteSql = "DELETE FROM rol_permiso WHERE id_rol_permiso = ?";
        jdbcTemplate.update(deleteSql, id);

        Map<String, Object> apiResponse = new HashMap<>();
        apiResponse.put("success", true);
        apiResponse.put("message", "Asignación eliminada exitosamente");

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/rol/{id_rol}/disponibles")
    public ResponseEntity<?> getDisponibles(@PathVariable Long id_rol) {
        String asigSql = "SELECT p.* FROM permisos p JOIN rol_permiso rp ON p.id_permiso = rp.id_permiso WHERE rp.id_rol = ?";
        List<Map<String, Object>> asignados = jdbcTemplate.queryForList(asigSql, id_rol);

        String dispSql = "SELECT p.* FROM permisos p WHERE p.id_permiso NOT IN (SELECT id_permiso FROM rol_permiso WHERE id_rol = ?)";
        List<Map<String, Object>> disponibles = jdbcTemplate.queryForList(dispSql, id_rol);

        Map<String, Object> data = new HashMap<>();
        data.put("permisos_asignados", asignados);
        data.put("permisos_disponibles", disponibles);

        Map<String, Object> apiResponse = new HashMap<>();
        apiResponse.put("success", true);
        apiResponse.put("data", data);

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/rol/{id_rol}/sincronizar")
    public ResponseEntity<?> sincronizar(@PathVariable Long id_rol, @RequestBody Map<String, Object> payload) {
        List<Number> permisosIdsRaw = (List<Number>) payload.get("id_permisos");
        
        jdbcTemplate.update("DELETE FROM rol_permiso WHERE id_rol = ?", id_rol);
        
        try {
            jdbcTemplate.execute("SELECT setval('rol_permiso_id_rol_permiso_seq', COALESCE((SELECT MAX(id_rol_permiso)+1 FROM rol_permiso), 1), false)");
        } catch (Exception e) {
            // Ignorar
        }
        
        if (permisosIdsRaw != null && !permisosIdsRaw.isEmpty()) {
            for (Number idPermiso : permisosIdsRaw) {
                jdbcTemplate.update("INSERT INTO rol_permiso (id_rol, id_permiso) VALUES (?, ?)", id_rol, idPermiso.longValue());
            }
        }

        Map<String, Object> apiResponse = new HashMap<>();
        apiResponse.put("success", true);
        apiResponse.put("message", "Permisos sincronizados correctamente");

        return ResponseEntity.ok(apiResponse);
    }
}
