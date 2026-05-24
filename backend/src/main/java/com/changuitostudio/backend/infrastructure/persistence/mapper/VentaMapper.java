package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Venta;
import com.changuitostudio.backend.infrastructure.persistence.entity.VentaEntity;

public class VentaMapper {

    public static Venta toDomain(VentaEntity entity) {
        if (entity == null) return null;
        Venta domain = new Venta();
        domain.setId(entity.getId());
        domain.setFecVen(entity.getFecVen());
        domain.setEstVen(entity.getEstVen());
        domain.setTotalVen(entity.getTotalVen());
        domain.setDescuento(entity.getDescuento());
        if (entity.getCliente() != null) {
            domain.setCliente(ClienteMapper.toDomain(entity.getCliente()));
        }
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setNotas(entity.getNotas());
        domain.setCodVen(entity.getCodVen());
        return domain;
    }

    public static VentaEntity toEntity(Venta domain) {
        if (domain == null) return null;
        VentaEntity entity = new VentaEntity();
        entity.setId(domain.getId());
        entity.setFecVen(domain.getFecVen());
        entity.setEstVen(domain.getEstVen());
        entity.setTotalVen(domain.getTotalVen());
        entity.setDescuento(domain.getDescuento());
        if (domain.getCliente() != null) {
            entity.setCliente(ClienteMapper.toEntity(domain.getCliente()));
        }
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setNotas(domain.getNotas());
        entity.setCodVen(domain.getCodVen());
        return entity;
    }
}
