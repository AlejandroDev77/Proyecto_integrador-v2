package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.MaterialEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class MaterialSpecifications {

    public static Specification<MaterialEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
