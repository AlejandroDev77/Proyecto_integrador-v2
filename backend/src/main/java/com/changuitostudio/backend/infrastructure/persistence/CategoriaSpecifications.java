package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.CategoriaEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

/**
 * Especificaciones JPA para construir querys dinámicamente con filtros
 */
public class CategoriaSpecifications {

    private CategoriaSpecifications() {
    }

    public static Specification<CategoriaEntity> fromFilters(Map<String, String> filters) {
        Specification<CategoriaEntity> spec = (root, query, cb) -> cb.conjunction();

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
                case "nom_cat" -> spec.and(likeFilter("nomCat", value));
                case "nombre" -> spec.and(likeFilter("nomCat", value));
                case "est_cat" -> spec.and(estadoFilter(value));
                default -> spec;
            };
        }

        return spec;
    }

    private static Specification<CategoriaEntity> searchFilter(String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("nomCat")), pattern);
    }

    private static Specification<CategoriaEntity> likeFilter(String field, String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get(field)), pattern);
    }

    private static Specification<CategoriaEntity> estadoFilter(String value) {
        Boolean estado = Boolean.parseBoolean(value);
        return (root, query, cb) -> cb.equal(root.get("estCat"), estado);
    }
}
