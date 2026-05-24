package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Pago;
import com.changuitostudio.backend.infrastructure.persistence.entity.PagoEntity;

public class PagoMapper {

    public static Pago toDomain(PagoEntity entity) {
        if (entity == null) return null;
        Pago domain = new Pago();
        domain.setId(entity.getId());
        domain.setMonto(entity.getMonto());
        domain.setFecPag(entity.getFecPag());
        domain.setMetodoPag(entity.getMetodoPag());
        domain.setReferenciaPag(entity.getReferenciaPag());
        if (entity.getVenta() != null) {
            domain.setVenta(VentaMapper.toDomain(entity.getVenta()));
        }
        domain.setCodPag(entity.getCodPag());
        return domain;
    }

    public static PagoEntity toEntity(Pago domain) {
        if (domain == null) return null;
        PagoEntity entity = new PagoEntity();
        entity.setId(domain.getId());
        entity.setMonto(domain.getMonto());
        entity.setFecPag(domain.getFecPag());
        entity.setMetodoPag(domain.getMetodoPag());
        entity.setReferenciaPag(domain.getReferenciaPag());
        if (domain.getVenta() != null) {
            entity.setVenta(VentaMapper.toEntity(domain.getVenta()));
        }
        entity.setCodPag(domain.getCodPag());
        return entity;
    }
}
