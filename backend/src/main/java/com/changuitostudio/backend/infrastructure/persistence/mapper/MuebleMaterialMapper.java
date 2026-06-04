package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.MuebleMaterial;
import com.changuitostudio.backend.infrastructure.persistence.entity.MuebleMaterialEntity;

public class MuebleMaterialMapper {

    public static MuebleMaterial toDomain(MuebleMaterialEntity entity) {
        if (entity == null) return null;
        MuebleMaterial domain = new MuebleMaterial();
        domain.setId(entity.getId());
        if (entity.getMueble() != null) {
            domain.setMueble(MuebleMapper.toDomain(entity.getMueble()));
        }
        if (entity.getMaterial() != null) {
            domain.setMaterial(MaterialMapper.toDomain(entity.getMaterial()));
        }
        domain.setCantidad(entity.getCantidad());
        domain.setCodMueMat(entity.getCodMueMat());
        domain.setEstMueMat(entity.getEstMueMat());
        return domain;
    }

    public static MuebleMaterialEntity toEntity(MuebleMaterial domain) {
        if (domain == null) return null;
        MuebleMaterialEntity entity = new MuebleMaterialEntity();
        entity.setId(domain.getId());
        if (domain.getMueble() != null) {
            entity.setMueble(MuebleMapper.toEntity(domain.getMueble()));
        }
        if (domain.getMaterial() != null) {
            entity.setMaterial(MaterialMapper.toEntity(domain.getMaterial()));
        }
        entity.setCantidad(domain.getCantidad());
        entity.setCodMueMat(domain.getCodMueMat());
        entity.setEstMueMat(domain.getEstMueMat());
        return entity;
    }
}
