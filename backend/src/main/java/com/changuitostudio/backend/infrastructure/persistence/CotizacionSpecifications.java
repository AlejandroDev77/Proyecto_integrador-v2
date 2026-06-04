package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.CotizacionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class CotizacionSpecifications {

    public static Specification<CotizacionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
