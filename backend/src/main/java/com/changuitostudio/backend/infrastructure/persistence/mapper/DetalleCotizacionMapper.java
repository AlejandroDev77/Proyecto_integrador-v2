package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.DetalleCotizacion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCotizacionEntity;

public class DetalleCotizacionMapper {

    public static DetalleCotizacion toDomain(DetalleCotizacionEntity entity) {
        if (entity == null) return null;
        DetalleCotizacion domain = new DetalleCotizacion();
        domain.setId(entity.getId());
        if (entity.getCotizacion() != null) {
            domain.setCotizacion(CotizacionMapper.toDomain(entity.getCotizacion()));
        }
        if (entity.getMueble() != null) {
            domain.setMueble(MuebleMapper.toDomain(entity.getMueble()));
        }
        domain.setDescPersonalizacion(entity.getDescPersonalizacion());
        domain.setCantidad(entity.getCantidad());
        domain.setPrecioUnitario(entity.getPrecioUnitario());
        domain.setSubtotal(entity.getSubtotal());
        domain.setCodDetCot(entity.getCodDetCot());
        domain.setNombreMueble(entity.getNombreMueble());
        domain.setTipoMueble(entity.getTipoMueble());
        domain.setDimensiones(entity.getDimensiones());
        domain.setMaterialPrincipal(entity.getMaterialPrincipal());
        domain.setColorAcabado(entity.getColorAcabado());
        domain.setImgReferencia(entity.getImgReferencia());
        domain.setHerrajes(entity.getHerrajes());
        return domain;
    }

    public static DetalleCotizacionEntity toEntity(DetalleCotizacion domain) {
        if (domain == null) return null;
        DetalleCotizacionEntity entity = new DetalleCotizacionEntity();
        entity.setId(domain.getId());
        if (domain.getCotizacion() != null) {
            entity.setCotizacion(CotizacionMapper.toEntity(domain.getCotizacion()));
        }
        if (domain.getMueble() != null) {
            entity.setMueble(MuebleMapper.toEntity(domain.getMueble()));
        }
        entity.setDescPersonalizacion(domain.getDescPersonalizacion());
        entity.setCantidad(domain.getCantidad());
        entity.setPrecioUnitario(domain.getPrecioUnitario());
        entity.setSubtotal(domain.getSubtotal());
        entity.setCodDetCot(domain.getCodDetCot());
        entity.setNombreMueble(domain.getNombreMueble());
        entity.setTipoMueble(domain.getTipoMueble());
        entity.setDimensiones(domain.getDimensiones());
        entity.setMaterialPrincipal(domain.getMaterialPrincipal());
        entity.setColorAcabado(domain.getColorAcabado());
        entity.setImgReferencia(domain.getImgReferencia());
        entity.setHerrajes(domain.getHerrajes());
        return entity;
    }
}
