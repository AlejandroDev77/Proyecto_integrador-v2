package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.ProveedorEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class ProveedorSpecifications {

    public static Specification<ProveedorEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
