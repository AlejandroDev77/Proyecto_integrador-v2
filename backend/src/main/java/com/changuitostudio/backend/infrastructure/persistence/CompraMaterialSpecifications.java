package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.CompraMaterialEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class CompraMaterialSpecifications {

    public static Specification<CompraMaterialEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
