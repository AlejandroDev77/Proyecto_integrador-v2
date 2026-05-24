package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.CostoCotizacionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class CostoCotizacionSpecifications {

    public static Specification<CostoCotizacionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
