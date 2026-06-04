package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.DetalleVenta;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleVentaEntity;

public class DetalleVentaMapper {

    public static DetalleVenta toDomain(DetalleVentaEntity entity) {
        if (entity == null) return null;
        DetalleVenta domain = new DetalleVenta();
        domain.setId(entity.getId());
        if (entity.getVenta() != null) {
            domain.setVenta(VentaMapper.toDomain(entity.getVenta()));
        }
        if (entity.getMueble() != null) {
            domain.setMueble(MuebleMapper.toDomain(entity.getMueble()));
        }
        domain.setCantidad(entity.getCantidad());
        domain.setPrecioUnitario(entity.getPrecioUnitario());
        domain.setDescuentoItem(entity.getDescuentoItem());
        domain.setSubtotal(entity.getSubtotal());
        domain.setCodDetVen(entity.getCodDetVen());
        return domain;
    }

    public static DetalleVentaEntity toEntity(DetalleVenta domain) {
        if (domain == null) return null;
        DetalleVentaEntity entity = new DetalleVentaEntity();
        entity.setId(domain.getId());
        if (domain.getVenta() != null) {
            entity.setVenta(VentaMapper.toEntity(domain.getVenta()));
        }
        if (domain.getMueble() != null) {
            entity.setMueble(MuebleMapper.toEntity(domain.getMueble()));
        }
        entity.setCantidad(domain.getCantidad());
        entity.setPrecioUnitario(domain.getPrecioUnitario());
        entity.setDescuentoItem(domain.getDescuentoItem());
        entity.setSubtotal(domain.getSubtotal());
        entity.setCodDetVen(domain.getCodDetVen());
        return entity;
    }
}
