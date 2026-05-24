package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.EvidenciaProduccionEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class EvidenciaProduccionSpecifications {

    public static Specification<EvidenciaProduccionEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
