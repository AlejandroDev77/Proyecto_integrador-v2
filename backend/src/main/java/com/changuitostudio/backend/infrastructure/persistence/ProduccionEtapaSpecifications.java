package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEtapaEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class ProduccionEtapaSpecifications {

    public static Specification<ProduccionEtapaEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
