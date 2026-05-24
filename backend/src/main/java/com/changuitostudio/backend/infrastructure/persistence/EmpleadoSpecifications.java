package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.EmpleadoEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class EmpleadoSpecifications {

    public static Specification<EmpleadoEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
