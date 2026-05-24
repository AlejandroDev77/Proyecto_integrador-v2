package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCotizacionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class DetalleCotizacionSpecifications {

    public static Specification<DetalleCotizacionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
