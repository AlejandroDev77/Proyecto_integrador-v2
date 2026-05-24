package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.PagoEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class PagoSpecifications {

    public static Specification<PagoEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
