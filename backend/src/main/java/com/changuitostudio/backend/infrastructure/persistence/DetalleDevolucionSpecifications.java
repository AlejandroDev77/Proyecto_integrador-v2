package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleDevolucionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class DetalleDevolucionSpecifications {

    public static Specification<DetalleDevolucionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
