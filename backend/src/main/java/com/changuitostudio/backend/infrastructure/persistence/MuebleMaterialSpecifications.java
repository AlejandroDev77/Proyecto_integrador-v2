package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.MuebleMaterialEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class MuebleMaterialSpecifications {

    public static Specification<MuebleMaterialEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
