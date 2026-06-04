package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Devolucion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DevolucionEntity;

public class DevolucionMapper {

    public static Devolucion toDomain(DevolucionEntity entity) {
        if (entity == null) return null;
        Devolucion domain = new Devolucion();
        domain.setId(entity.getId());
        domain.setFecDev(entity.getFecDev());
        domain.setMotivoDev(entity.getMotivoDev());
        if (entity.getVenta() != null) {
            domain.setVenta(VentaMapper.toDomain(entity.getVenta()));
        }
        domain.setTotalDev(entity.getTotalDev());
        domain.setEstDev(entity.getEstDev());
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setCodDev(entity.getCodDev());
        return domain;
    }

    public static DevolucionEntity toEntity(Devolucion domain) {
        if (domain == null) return null;
        DevolucionEntity entity = new DevolucionEntity();
        entity.setId(domain.getId());
        entity.setFecDev(domain.getFecDev());
        entity.setMotivoDev(domain.getMotivoDev());
        if (domain.getVenta() != null) {
            entity.setVenta(VentaMapper.toEntity(domain.getVenta()));
        }
        entity.setTotalDev(domain.getTotalDev());
        entity.setEstDev(domain.getEstDev());
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setCodDev(domain.getCodDev());
        return entity;
    }
}
