package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.CostoCotizacion;
import com.changuitostudio.backend.infrastructure.persistence.entity.CostoCotizacionEntity;

public class CostoCotizacionMapper {

    public static CostoCotizacion toDomain(CostoCotizacionEntity entity) {
        if (entity == null) return null;
        CostoCotizacion domain = new CostoCotizacion();
        domain.setId(entity.getId());
        if (entity.getCotizacion() != null) {
            domain.setCotizacion(CotizacionMapper.toDomain(entity.getCotizacion()));
        }
        domain.setCostoMateriales(entity.getCostoMateriales());
        domain.setCostoManoObra(entity.getCostoManoObra());
        domain.setCostosIndirectos(entity.getCostosIndirectos());
        domain.setMargenGanancia(entity.getMargenGanancia());
        domain.setCostoTotal(entity.getCostoTotal());
        domain.setPrecioSugerido(entity.getPrecioSugerido());
        return domain;
    }

    public static CostoCotizacionEntity toEntity(CostoCotizacion domain) {
        if (domain == null) return null;
        CostoCotizacionEntity entity = new CostoCotizacionEntity();
        entity.setId(domain.getId());
        if (domain.getCotizacion() != null) {
            entity.setCotizacion(CotizacionMapper.toEntity(domain.getCotizacion()));
        }
        entity.setCostoMateriales(domain.getCostoMateriales());
        entity.setCostoManoObra(domain.getCostoManoObra());
        entity.setCostosIndirectos(domain.getCostosIndirectos());
        entity.setMargenGanancia(domain.getMargenGanancia());
        entity.setCostoTotal(domain.getCostoTotal());
        entity.setPrecioSugerido(domain.getPrecioSugerido());
        return entity;
    }
}
