package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.EtapaProduccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.EtapaProduccionEntity;

public class EtapaProduccionMapper {

    public static EtapaProduccion toDomain(EtapaProduccionEntity entity) {
        if (entity == null) return null;
        EtapaProduccion domain = new EtapaProduccion();
        domain.setId(entity.getId());
        domain.setNomEta(entity.getNomEta());
        domain.setDescEta(entity.getDescEta());
        domain.setDuracionEstimada(entity.getDuracionEstimada());
        domain.setOrdenSecuencia(entity.getOrdenSecuencia());
        domain.setCodEta(entity.getCodEta());
        return domain;
    }

    public static EtapaProduccionEntity toEntity(EtapaProduccion domain) {
        if (domain == null) return null;
        EtapaProduccionEntity entity = new EtapaProduccionEntity();
        entity.setId(domain.getId());
        entity.setNomEta(domain.getNomEta());
        entity.setDescEta(domain.getDescEta());
        entity.setDuracionEstimada(domain.getDuracionEstimada());
        entity.setOrdenSecuencia(domain.getOrdenSecuencia());
        entity.setCodEta(domain.getCodEta());
        return entity;
    }
}
