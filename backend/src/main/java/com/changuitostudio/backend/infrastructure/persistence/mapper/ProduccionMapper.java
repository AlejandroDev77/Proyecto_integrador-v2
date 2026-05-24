package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Produccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEntity;

public class ProduccionMapper {

    public static Produccion toDomain(ProduccionEntity entity) {
        if (entity == null) return null;
        Produccion domain = new Produccion();
        domain.setId(entity.getId());
        domain.setFecIni(entity.getFecIni());
        domain.setFecFinEstimada(entity.getFecFinEstimada());
        domain.setFecFin(entity.getFecFin());
        domain.setEstPro(entity.getEstPro());
        domain.setPrioridad(entity.getPrioridad());
        if (entity.getVenta() != null) {
            domain.setVenta(VentaMapper.toDomain(entity.getVenta()));
        }
        if (entity.getCotizacion() != null) {
            domain.setCotizacion(CotizacionMapper.toDomain(entity.getCotizacion()));
        }
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setNotas(entity.getNotas());
        domain.setCodPro(entity.getCodPro());
        return domain;
    }

    public static ProduccionEntity toEntity(Produccion domain) {
        if (domain == null) return null;
        ProduccionEntity entity = new ProduccionEntity();
        entity.setId(domain.getId());
        entity.setFecIni(domain.getFecIni());
        entity.setFecFinEstimada(domain.getFecFinEstimada());
        entity.setFecFin(domain.getFecFin());
        entity.setEstPro(domain.getEstPro());
        entity.setPrioridad(domain.getPrioridad());
        if (domain.getVenta() != null) {
            entity.setVenta(VentaMapper.toEntity(domain.getVenta()));
        }
        if (domain.getCotizacion() != null) {
            entity.setCotizacion(CotizacionMapper.toEntity(domain.getCotizacion()));
        }
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setNotas(domain.getNotas());
        entity.setCodPro(domain.getCodPro());
        return entity;
    }
}
