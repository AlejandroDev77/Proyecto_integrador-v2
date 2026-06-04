package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.PermisoEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

//filtros search, nom_permiso, descripcion

public class PermisoSpecifications {

    private PermisoSpecifications() {
    }

    public static Specification<PermisoEntity> fromFilters(Map<String, String> filters) {
        Specification<PermisoEntity> spec = (root, query, cb) -> cb.conjunction();

        if (filters == null || filters.isEmpty()) {
            return spec;
        }

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value == null || value.isBlank())
                continue;

            spec = switch (key) {
                case "search" -> spec.and(searchFilter(value));
                case "nom_permiso" -> spec.and(likeFilter("nombre", value));
                case "nombre" -> spec.and(likeFilter("nombre", value));
                case "descripcion" -> spec.and(likeFilter("descripcion", value));
                default -> spec;
            };
        }

        return spec;
    }

    private static Specification<PermisoEntity> searchFilter(String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("nombre")), pattern),
                cb.like(cb.lower(root.get("descripcion")), pattern)
        );
    }

    private static Specification<PermisoEntity> likeFilter(String field, String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get(field)), pattern);
    }
}
