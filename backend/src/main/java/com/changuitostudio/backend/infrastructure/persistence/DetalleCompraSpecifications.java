package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCompraEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class DetalleCompraSpecifications {

    public static Specification<DetalleCompraEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
