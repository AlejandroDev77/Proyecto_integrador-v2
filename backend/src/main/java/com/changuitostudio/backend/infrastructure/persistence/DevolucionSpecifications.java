package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.DevolucionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class DevolucionSpecifications {

    public static Specification<DevolucionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
