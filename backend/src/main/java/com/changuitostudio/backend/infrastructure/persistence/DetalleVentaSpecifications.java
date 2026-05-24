package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleVentaEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class DetalleVentaSpecifications {

    public static Specification<DetalleVentaEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
