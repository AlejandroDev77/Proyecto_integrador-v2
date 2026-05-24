package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.EvidenciaProduccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.EvidenciaProduccionEntity;

public class EvidenciaProduccionMapper {

    public static EvidenciaProduccion toDomain(EvidenciaProduccionEntity entity) {
        if (entity == null) return null;
        EvidenciaProduccion domain = new EvidenciaProduccion();
        domain.setId(entity.getId());
        if (entity.getProduccionEtapa() != null) {
            domain.setProduccionEtapa(ProduccionEtapaMapper.toDomain(entity.getProduccionEtapa()));
        }
        domain.setTipoEvi(entity.getTipoEvi());
        domain.setArchivoEvi(entity.getArchivoEvi());
        domain.setDescripcion(entity.getDescripcion());
        domain.setFecEvi(entity.getFecEvi());
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setCodEvi(entity.getCodEvi());
        return domain;
    }

    public static EvidenciaProduccionEntity toEntity(EvidenciaProduccion domain) {
        if (domain == null) return null;
        EvidenciaProduccionEntity entity = new EvidenciaProduccionEntity();
        entity.setId(domain.getId());
        if (domain.getProduccionEtapa() != null) {
            entity.setProduccionEtapa(ProduccionEtapaMapper.toEntity(domain.getProduccionEtapa()));
        }
        entity.setTipoEvi(domain.getTipoEvi());
        entity.setArchivoEvi(domain.getArchivoEvi());
        entity.setDescripcion(domain.getDescripcion());
        entity.setFecEvi(domain.getFecEvi());
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setCodEvi(domain.getCodEvi());
        return entity;
    }
}
