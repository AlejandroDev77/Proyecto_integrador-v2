package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.DisenoEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class DisenoSpecifications {

    public static Specification<DisenoEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
