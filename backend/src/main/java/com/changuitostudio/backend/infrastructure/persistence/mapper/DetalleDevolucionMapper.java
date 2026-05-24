package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.DetalleDevolucion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleDevolucionEntity;

public class DetalleDevolucionMapper {

    public static DetalleDevolucion toDomain(DetalleDevolucionEntity entity) {
        if (entity == null) return null;
        DetalleDevolucion domain = new DetalleDevolucion();
        domain.setId(entity.getId());
        if (entity.getDevolucion() != null) {
            domain.setDevolucion(DevolucionMapper.toDomain(entity.getDevolucion()));
        }
        if (entity.getMueble() != null) {
            domain.setMueble(MuebleMapper.toDomain(entity.getMueble()));
        }
        domain.setCantidad(entity.getCantidad());
        domain.setPrecioUnitario(entity.getPrecioUnitario());
        domain.setSubtotal(entity.getSubtotal());
        domain.setCodDetDev(entity.getCodDetDev());
        return domain;
    }

    public static DetalleDevolucionEntity toEntity(DetalleDevolucion domain) {
        if (domain == null) return null;
        DetalleDevolucionEntity entity = new DetalleDevolucionEntity();
        entity.setId(domain.getId());
        if (domain.getDevolucion() != null) {
            entity.setDevolucion(DevolucionMapper.toEntity(domain.getDevolucion()));
        }
        if (domain.getMueble() != null) {
            entity.setMueble(MuebleMapper.toEntity(domain.getMueble()));
        }
        entity.setCantidad(domain.getCantidad());
        entity.setPrecioUnitario(domain.getPrecioUnitario());
        entity.setSubtotal(domain.getSubtotal());
        entity.setCodDetDev(domain.getCodDetDev());
        return entity;
    }
}
