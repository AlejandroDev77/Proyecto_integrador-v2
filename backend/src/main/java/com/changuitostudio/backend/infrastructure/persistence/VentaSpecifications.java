package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.VentaEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class VentaSpecifications {

    public static Specification<VentaEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
