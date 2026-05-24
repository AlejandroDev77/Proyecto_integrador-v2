package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.DetalleProduccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleProduccionEntity;

public class DetalleProduccionMapper {

    public static DetalleProduccion toDomain(DetalleProduccionEntity entity) {
        if (entity == null) return null;
        DetalleProduccion domain = new DetalleProduccion();
        domain.setId(entity.getId());
        if (entity.getProduccion() != null) {
            domain.setProduccion(ProduccionMapper.toDomain(entity.getProduccion()));
        }
        if (entity.getMueble() != null) {
            domain.setMueble(MuebleMapper.toDomain(entity.getMueble()));
        }
        domain.setCantidad(entity.getCantidad());
        domain.setEstDetPro(entity.getEstDetPro());
        domain.setCodDetPro(entity.getCodDetPro());
        return domain;
    }

    public static DetalleProduccionEntity toEntity(DetalleProduccion domain) {
        if (domain == null) return null;
        DetalleProduccionEntity entity = new DetalleProduccionEntity();
        entity.setId(domain.getId());
        if (domain.getProduccion() != null) {
            entity.setProduccion(ProduccionMapper.toEntity(domain.getProduccion()));
        }
        if (domain.getMueble() != null) {
            entity.setMueble(MuebleMapper.toEntity(domain.getMueble()));
        }
        entity.setCantidad(domain.getCantidad());
        entity.setEstDetPro(domain.getEstDetPro());
        entity.setCodDetPro(domain.getCodDetPro());
        return entity;
    }
}
