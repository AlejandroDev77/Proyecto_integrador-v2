package com.changuitostudio.backend.infrastructure.adapter.out.persistence;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;
//import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;


public class RolSpecifications {

    private RolSpecifications() {
    }

    public static Specification<RolEntity> fromFilters(Map<String, String> filters) {
        Specification<RolEntity> spec = (root, query, cb) -> cb.conjunction();

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
                case "nom_rol" -> spec.and(likeFilter("nomRol", value));
               /*  case "est_rol" -> spec.and(estadoFilter(value));  */
                default -> spec;
            };
        }

        return spec;
    }

    private static Specification<RolEntity> searchFilter(String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("nomRol")), pattern);
    }

    private static Specification<RolEntity> likeFilter(String field, String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get(field)), pattern);
    }

    /* private static Specification<RolEntity> estadoFilter(String value) {
        boolean estado = Boolean.parseBoolean(value);
        return (root, query, cb) -> cb.equal(root.get("estRol"), estado);
    } */
}