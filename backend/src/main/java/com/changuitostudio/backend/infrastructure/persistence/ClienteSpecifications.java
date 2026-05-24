package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.infrastructure.persistence.entity.ClienteEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class ClienteSpecifications {

    public static Specification<ClienteEntity> byFilters(Map<String, String> filters) {
        return GenericFilterSpecification.fromFilters(filters);
    }
}
