package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.DetalleCompra;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCompraEntity;

public class DetalleCompraMapper {

    public static DetalleCompra toDomain(DetalleCompraEntity entity) {
        if (entity == null) return null;
        DetalleCompra domain = new DetalleCompra();
        domain.setId(entity.getId());
        if (entity.getCompra() != null) {
            domain.setCompra(CompraMaterialMapper.toDomain(entity.getCompra()));
        }
        if (entity.getMaterial() != null) {
            domain.setMaterial(MaterialMapper.toDomain(entity.getMaterial()));
        }
        domain.setCantidad(entity.getCantidad());
        domain.setPrecioUnitario(entity.getPrecioUnitario());
        domain.setSubtotal(entity.getSubtotal());
        domain.setCodDetComp(entity.getCodDetComp());
        domain.setEstDetComp(entity.getEstDetComp());
        return domain;
    }

    public static DetalleCompraEntity toEntity(DetalleCompra domain) {
        if (domain == null) return null;
        DetalleCompraEntity entity = new DetalleCompraEntity();
        entity.setId(domain.getId());
        if (domain.getCompra() != null) {
            entity.setCompra(CompraMaterialMapper.toEntity(domain.getCompra()));
        }
        if (domain.getMaterial() != null) {
            entity.setMaterial(MaterialMapper.toEntity(domain.getMaterial()));
        }
        entity.setCantidad(domain.getCantidad());
        entity.setPrecioUnitario(domain.getPrecioUnitario());
        entity.setSubtotal(domain.getSubtotal());
        entity.setCodDetComp(domain.getCodDetComp());
        entity.setEstDetComp(domain.getEstDetComp());
        return entity;
    }
}
