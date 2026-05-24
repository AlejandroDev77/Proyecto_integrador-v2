package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleProduccionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class DetalleProduccionSpecifications {

    public static Specification<DetalleProduccionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
