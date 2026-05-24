package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Cotizacion;
import com.changuitostudio.backend.infrastructure.persistence.entity.CotizacionEntity;

public class CotizacionMapper {

    public static Cotizacion toDomain(CotizacionEntity entity) {
        if (entity == null) return null;
        Cotizacion domain = new Cotizacion();
        domain.setId(entity.getId());
        domain.setFecCot(entity.getFecCot());
        domain.setEstCot(entity.getEstCot());
        domain.setValidezDias(entity.getValidezDias());
        domain.setTotalCot(entity.getTotalCot());
        domain.setDescuento(entity.getDescuento());
        if (entity.getCliente() != null) {
            domain.setCliente(ClienteMapper.toDomain(entity.getCliente()));
        }
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setNotas(entity.getNotas());
        domain.setCodCot(entity.getCodCot());
        domain.setPresupuestoCliente(entity.getPresupuestoCliente());
        domain.setPlazoEsperado(entity.getPlazoEsperado());
        domain.setTiempoEntrega(entity.getTiempoEntrega());
        domain.setDireccionInstalacion(entity.getDireccionInstalacion());
        domain.setTipoProyecto(entity.getTipoProyecto());
        return domain;
    }

    public static CotizacionEntity toEntity(Cotizacion domain) {
        if (domain == null) return null;
        CotizacionEntity entity = new CotizacionEntity();
        entity.setId(domain.getId());
        entity.setFecCot(domain.getFecCot());
        entity.setEstCot(domain.getEstCot());
        entity.setValidezDias(domain.getValidezDias());
        entity.setTotalCot(domain.getTotalCot());
        entity.setDescuento(domain.getDescuento());
        if (domain.getCliente() != null) {
            entity.setCliente(ClienteMapper.toEntity(domain.getCliente()));
        }
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setNotas(domain.getNotas());
        entity.setCodCot(domain.getCodCot());
        entity.setPresupuestoCliente(domain.getPresupuestoCliente());
        entity.setPlazoEsperado(domain.getPlazoEsperado());
        entity.setTiempoEntrega(domain.getTiempoEntrega());
        entity.setDireccionInstalacion(domain.getDireccionInstalacion());
        entity.setTipoProyecto(domain.getTipoProyecto());
        return entity;
    }
}
