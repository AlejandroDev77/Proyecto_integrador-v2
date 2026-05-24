package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.ProduccionEtapa;
import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEtapaEntity;

public class ProduccionEtapaMapper {

    public static ProduccionEtapa toDomain(ProduccionEtapaEntity entity) {
        if (entity == null) return null;
        ProduccionEtapa domain = new ProduccionEtapa();
        domain.setId(entity.getId());
        if (entity.getProduccion() != null) {
            domain.setProduccion(ProduccionMapper.toDomain(entity.getProduccion()));
        }
        if (entity.getEtapaProduccion() != null) {
            domain.setEtapaProduccion(EtapaProduccionMapper.toDomain(entity.getEtapaProduccion()));
        }
        domain.setFecIni(entity.getFecIni());
        domain.setFecFin(entity.getFecFin());
        domain.setEstEta(entity.getEstEta());
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setNotas(entity.getNotas());
        domain.setCodProEta(entity.getCodProEta());
        domain.setFotosProgreso(entity.getFotosProgreso());
        return domain;
    }

    public static ProduccionEtapaEntity toEntity(ProduccionEtapa domain) {
        if (domain == null) return null;
        ProduccionEtapaEntity entity = new ProduccionEtapaEntity();
        entity.setId(domain.getId());
        if (domain.getProduccion() != null) {
            entity.setProduccion(ProduccionMapper.toEntity(domain.getProduccion()));
        }
        if (domain.getEtapaProduccion() != null) {
            entity.setEtapaProduccion(EtapaProduccionMapper.toEntity(domain.getEtapaProduccion()));
        }
        entity.setFecIni(domain.getFecIni());
        entity.setFecFin(domain.getFecFin());
        entity.setEstEta(domain.getEstEta());
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setNotas(domain.getNotas());
        entity.setCodProEta(domain.getCodProEta());
        entity.setFotosProgreso(domain.getFotosProgreso());
        return entity;
    }
}
