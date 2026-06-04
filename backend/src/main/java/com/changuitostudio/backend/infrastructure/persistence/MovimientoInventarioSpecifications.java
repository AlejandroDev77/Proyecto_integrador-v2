package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.MovimientoInventarioEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class MovimientoInventarioSpecifications {

    public static Specification<MovimientoInventarioEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
