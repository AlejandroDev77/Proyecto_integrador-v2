package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class ProduccionSpecifications {

    public static Specification<ProduccionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
