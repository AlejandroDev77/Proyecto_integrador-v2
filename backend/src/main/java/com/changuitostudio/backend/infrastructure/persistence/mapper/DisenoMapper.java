package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Diseno;
import com.changuitostudio.backend.infrastructure.persistence.entity.DisenoEntity;

public class DisenoMapper {

    public static Diseno toDomain(DisenoEntity entity) {
        if (entity == null) return null;
        Diseno domain = new Diseno();
        domain.setId(entity.getId());
        domain.setNomDis(entity.getNomDis());
        domain.setDescDis(entity.getDescDis());
        domain.setArchivo3d(entity.getArchivo3d());
        domain.setImgDis(entity.getImgDis());
        if (entity.getCotizacion() != null) {
            domain.setCotizacion(CotizacionMapper.toDomain(entity.getCotizacion()));
        }
        domain.setCodDis(entity.getCodDis());
        return domain;
    }

    public static DisenoEntity toEntity(Diseno domain) {
        if (domain == null) return null;
        DisenoEntity entity = new DisenoEntity();
        entity.setId(domain.getId());
        entity.setNomDis(domain.getNomDis());
        entity.setDescDis(domain.getDescDis());
        entity.setArchivo3d(domain.getArchivo3d());
        entity.setImgDis(domain.getImgDis());
        if (domain.getCotizacion() != null) {
            entity.setCotizacion(CotizacionMapper.toEntity(domain.getCotizacion()));
        }
        entity.setCodDis(domain.getCodDis());
        return entity;
    }
}
