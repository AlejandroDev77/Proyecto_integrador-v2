package com.changuitostudio.backend.infrastructure.persistence;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Map;

/**
 * Utilidad genérica para construir Specifications de JPA a partir de un Map de filtros.
 * Convierte automáticamente keys en snake_case a camelCase para los campos de la Entity.
 * Soporta: LIKE parcial, igualdad exacta, booleanos, fechas exactas, rangos de fecha y rangos numéricos.
 */
public final class GenericFilterSpecification {

    private GenericFilterSpecification() {}

    /**
     * Construye una Specification genérica a partir de un mapa de filtros.
     * Los keys deben venir en snake_case. Se convierten a camelCase para los campos de la Entity.
     * 
     * Convenciones:
     *  - key termina en _min → filtro >=  (numeros o fechas)
     *  - key termina en _max → filtro <=  (numeros o fechas)
     *  - key termina en _exact o _exacta → igualdad exacta para fechas
     *  - key termina en _desde → filtro >= para fechas
     *  - key termina en _hasta → filtro <= para fechas
     *  - valor es "true"/"false"/"1"/"0" y el campo Java es Boolean → filtro booleano
     *  - en cualquier otro caso → LIKE parcial (case-insensitive) para Strings
     *  
     * Para filtros sobre relaciones (joins), el key debe usar "." como separador.
     * Ejemplo: "cliente.nom_cli" → join("cliente").get("nomCli")
     */
    public static <T> Specification<T> fromFilters(Map<String, String> filters) {
        Specification<T> spec = (root, query, cb) -> cb.conjunction();

        if (filters == null || filters.isEmpty()) {
            return spec;
        }

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value == null || value.isBlank()) continue;

            // Strip "filter[...]" wrapper if present
            if (key.startsWith("filter[") && key.endsWith("]")) {
                key = key.substring(7, key.length() - 1);
            }

            spec = spec.and(buildPredicate(key, value));
        }

        return spec;
    }

    private static <T> Specification<T> buildPredicate(String key, String value) {
        // Date range: _desde, _hasta, _exact, _exacta
        if (key.endsWith("_desde")) {
            String field = snakeToCamel(key.substring(0, key.length() - 6));
            return dateGte(field, value);
        }
        if (key.endsWith("_hasta")) {
            String field = snakeToCamel(key.substring(0, key.length() - 6));
            return dateLte(field, value);
        }
        if (key.endsWith("_exacta") || key.endsWith("_exact")) {
            String suffix = key.endsWith("_exacta") ? "_exacta" : "_exact";
            String field = snakeToCamel(key.substring(0, key.length() - suffix.length()));
            return dateEqual(field, value);
        }

        // Numeric range: _min, _max
        if (key.endsWith("_min")) {
            String field = snakeToCamel(key.substring(0, key.length() - 4));
            return numericGte(field, value);
        }
        if (key.endsWith("_max")) {
            String field = snakeToCamel(key.substring(0, key.length() - 4));
            return numericLte(field, value);
        }

        // Estado / boolean fields (est_*)
        String camelKey = snakeToCamel(key);
        if (value.equalsIgnoreCase("true") || value.equalsIgnoreCase("false")
                || value.equals("1") || value.equals("0")) {
            // Could be boolean or string. Try both approaches.
            if (key.startsWith("est_")) {
                // Check if it's a string estado (like "Completado") or boolean
                if (value.equalsIgnoreCase("true") || value.equalsIgnoreCase("false")
                    || value.equals("1") || value.equals("0")) {
                    Boolean boolVal = "1".equals(value) || "true".equalsIgnoreCase(value);
                    return booleanOrStringFilter(camelKey, value, boolVal);
                }
            }
        }

        // Join filter: if key contains "." like "cliente.nom_cli"
        if (key.contains(".")) {
            String[] parts = key.split("\\.", 2);
            String joinField = parts[0];
            String entityField = snakeToCamel(parts[1]);
            return joinLikeFilter(joinField, entityField, value);
        }

        // Relationship filter shortcuts (nom_cli on cotizacion => join cliente)
        // These are common cross-entity filter patterns
        // For simplicity, we apply a LIKE on the direct entity field
        // The controller should handle join-based filters separately if needed

        // Default: LIKE partial match (case-insensitive) for string fields
        return likeFilter(camelKey, value);
    }

    // --- Filter builders ---

    private static <T> Specification<T> likeFilter(String field, String value) {
        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, cb) -> {
            try {
                Path<String> path = root.get(field);
                return cb.like(cb.lower(path), pattern);
            } catch (IllegalArgumentException e) {
                // Field doesn't exist on entity, ignore
                return cb.conjunction();
            }
        };
    }

    private static <T> Specification<T> joinLikeFilter(String joinField, String entityField, String value) {
        return (root, query, cb) -> {
            try {
                Join<Object, Object> join = root.join(joinField, JoinType.LEFT);
                Path<?> path = join.get(entityField);
                Class<?> javaType = path.getJavaType();

                if (Number.class.isAssignableFrom(javaType) || javaType == long.class || javaType == int.class || javaType == double.class) {
                    // Numeric field: use exact equal
                    if (javaType == Long.class || javaType == long.class) {
                        return cb.equal(path, Long.parseLong(value));
                    } else if (javaType == Integer.class || javaType == int.class) {
                        return cb.equal(path, Integer.parseInt(value));
                    } else {
                        return cb.equal(path, Double.parseDouble(value));
                    }
                } else {
                    // String field: use LIKE partial match (case-insensitive)
                    String pattern = "%" + value.toLowerCase() + "%";
                    return cb.like(cb.lower(join.get(entityField)), pattern);
                }
            } catch (Exception e) {
                return cb.conjunction();
            }
        };
    }

    private static <T> Specification<T> booleanOrStringFilter(String field, String strValue, Boolean boolValue) {
        return (root, query, cb) -> {
            try {
                Path<?> path = root.get(field);
                Class<?> javaType = path.getJavaType();
                if (javaType == Boolean.class || javaType == boolean.class) {
                    return cb.equal(root.get(field), boolValue);
                } else {
                    // It's a String field (like est_cot = "Aprobado")
                    return cb.like(cb.lower(root.get(field)), "%" + strValue.toLowerCase() + "%");
                }
            } catch (IllegalArgumentException e) {
                return cb.conjunction();
            }
        };
    }

    private static <T> Specification<T> dateEqual(String field, String value) {
        return (root, query, cb) -> {
            try {
                LocalDate date = LocalDate.parse(value);
                return cb.equal(root.get(field), date);
            } catch (Exception e) {
                return cb.conjunction();
            }
        };
    }

    private static <T> Specification<T> dateGte(String field, String value) {
        return (root, query, cb) -> {
            try {
                LocalDate date = LocalDate.parse(value);
                return cb.greaterThanOrEqualTo(root.get(field), date);
            } catch (Exception e) {
                return cb.conjunction();
            }
        };
    }

    private static <T> Specification<T> dateLte(String field, String value) {
        return (root, query, cb) -> {
            try {
                LocalDate date = LocalDate.parse(value);
                return cb.lessThanOrEqualTo(root.get(field), date);
            } catch (Exception e) {
                return cb.conjunction();
            }
        };
    }

    private static <T> Specification<T> numericGte(String field, String value) {
        return (root, query, cb) -> {
            try {
                Path<Object> path = root.get(field);
                Class<?> javaType = path.getJavaType();
                if (javaType == Integer.class || javaType == int.class) {
                    return cb.greaterThanOrEqualTo(root.<Integer>get(field), Integer.parseInt(value));
                } else if (javaType == Long.class || javaType == long.class) {
                    return cb.greaterThanOrEqualTo(root.<Long>get(field), Long.parseLong(value));
                } else {
                    return cb.greaterThanOrEqualTo(root.<Double>get(field), Double.parseDouble(value));
                }
            } catch (Exception e) {
                return cb.conjunction();
            }
        };
    }

    private static <T> Specification<T> numericLte(String field, String value) {
        return (root, query, cb) -> {
            try {
                Path<Object> path = root.get(field);
                Class<?> javaType = path.getJavaType();
                if (javaType == Integer.class || javaType == int.class) {
                    return cb.lessThanOrEqualTo(root.<Integer>get(field), Integer.parseInt(value));
                } else if (javaType == Long.class || javaType == long.class) {
                    return cb.lessThanOrEqualTo(root.<Long>get(field), Long.parseLong(value));
                } else {
                    return cb.lessThanOrEqualTo(root.<Double>get(field), Double.parseDouble(value));
                }
            } catch (Exception e) {
                return cb.conjunction();
            }
        };
    }

    /**
     * Convierte snake_case a camelCase.
     * Ejemplo: "nom_cli" → "nomCli", "ap_pat_cli" → "apPatCli"
     */
    public static String snakeToCamel(String snake) {
        if (snake == null || snake.isEmpty()) return snake;
        StringBuilder sb = new StringBuilder();
        boolean nextUpper = false;
        for (int i = 0; i < snake.length(); i++) {
            char c = snake.charAt(i);
            if (c == '_') {
                nextUpper = true;
            } else {
                sb.append(nextUpper ? Character.toUpperCase(c) : c);
                nextUpper = false;
            }
        }
        return sb.toString();
    }
}
