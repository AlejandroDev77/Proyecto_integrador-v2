package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.MuebleEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

/**
 * Especificaciones JPA para construir querys dinámicamente con filtros
 */
public class MuebleSpecifications {

    private MuebleSpecifications() {
    }

    public static Specification<MuebleEntity> fromFilters(Map<String, String> filters) {
        Specification<MuebleEntity> spec = (root, query, cb) -> cb.conjunction();

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
                case "cod_mue" -> spec.and(likeFilter("codMue", value));
                case "nom_mue" -> spec.and(likeFilter("nomMue", value));
                case "nombre" -> spec.and(likeFilter("nomMue", value));
                case "codigo" -> spec.and(likeFilter("codMue", value));
                case "descripcion" -> spec.and(likeFilter("descMue", value));
                case "id_cat" -> spec.and(categoriaFilter(value));
                case "categoria" -> spec.and(categoriaNombreFilter(value));
                case "est_mue" -> spec.and(estadoFilter(value));
                default -> spec;
            };
        }

        return spec;
    }

    private static Specification<MuebleEntity> searchFilter(String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("nomMue")), pattern),
                cb.like(cb.lower(root.get("codMue")), pattern),
                cb.like(cb.lower(root.get("descMue")), pattern)
        );
    }

    private static Specification<MuebleEntity> likeFilter(String field, String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get(field)), pattern);
    }

    private static Specification<MuebleEntity> categoriaFilter(String value) {
        try {
            Long idCat = Long.parseLong(value);
            return (root, query, cb) -> cb.equal(root.get("categoria").get("idCat"), idCat);
        } catch (NumberFormatException e) {
            return (root, query, cb) -> cb.conjunction();
        }
    }

    private static Specification<MuebleEntity> categoriaNombreFilter(String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("categoria").get("nomCat")), pattern);
    }

    private static Specification<MuebleEntity> estadoFilter(String value) {
        Boolean estado = Boolean.parseBoolean(value);
        return (root, query, cb) -> cb.equal(root.get("estMue"), estado);
    }
}
