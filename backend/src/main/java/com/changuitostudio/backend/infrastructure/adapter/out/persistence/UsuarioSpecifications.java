package com.changuitostudio.backend.infrastructure.adapter.out.persistence;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

/**
 * Specifications dinámicas para filtrar usuarios.
 * Replica los filtros de Spatie QueryBuilder del backend Laravel.
 */
public class UsuarioSpecifications {

    private UsuarioSpecifications() {
    }

    /**
     * Construye una Specification a partir del mapa de filtros del frontend.
     * Soporta: search, cod_usu, nom_usu, email_usu, nom_rol, est_usu, id_rol
     */
    public static Specification<UsuarioEntity> fromFilters(Map<String, String> filters) {
        Specification<UsuarioEntity> spec = (root, query, cb) -> cb.conjunction();

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
                case "cod_usu" -> spec.and(likeFilter("codUsu", value));
                case "nom_usu" -> spec.and(likeFilter("nomUsu", value));
                case "email_usu" -> spec.and(likeFilter("emailUsu", value));
                case "nom_rol" -> spec.and(rolNameFilter(value));
                case "est_usu" -> spec.and(estadoFilter(value));
                case "id_rol" -> spec.and(equalFilter("idRol", Long.parseLong(value)));
                default -> spec;
            };
        }

        return spec;
    }

    /**
     * Filtro global de búsqueda: busca en nom_usu, email_usu, cod_usu.
     */
    private static Specification<UsuarioEntity> searchFilter(String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("nomUsu")), pattern),
                cb.like(cb.lower(root.get("emailUsu")), pattern),
                cb.like(cb.lower(root.get("codUsu")), pattern));
    }

    /**
     * Filtro LIKE parcial sobre un campo string.
     */
    private static Specification<UsuarioEntity> likeFilter(String field, String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get(field)), pattern);
    }

    /**
     * Filtro por nombre de rol (join a tabla roles).
     */
    private static Specification<UsuarioEntity> rolNameFilter(String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> {
            root.join("rol", JoinType.LEFT);
            return cb.like(cb.lower(root.get("rol").get("nomRol")), pattern);
        };
    }

    /**
     * Filtro por estado (boolean: 1/0 o true/false).
     */
    private static Specification<UsuarioEntity> estadoFilter(String value) {
        Boolean estado = "1".equals(value) || "true".equalsIgnoreCase(value);
        return (root, query, cb) -> cb.equal(root.get("estUsu"), estado);
    }

    /**
     * Filtro de igualdad exacta.
     */
    private static <T> Specification<UsuarioEntity> equalFilter(String field, T value) {
        return (root, query, cb) -> cb.equal(root.get(field), value);
    }
}
