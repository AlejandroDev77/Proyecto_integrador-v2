package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.GeneracionIA;
import com.changuitostudio.backend.infrastructure.persistence.entity.GeneracionIAEntity;
import org.springframework.stereotype.Component;

@Component
public class GeneracionIAMapper {

    public static GeneracionIA toDomain(GeneracionIAEntity entity) {
        if (entity == null) return null;
        GeneracionIA domain = new GeneracionIA();
        domain.setId(entity.getIdGen());
        domain.setNombreMueble(entity.getNomMue());
        domain.setImagenesReferencia(entity.getImgsRef());
        domain.setModelo3dUrl(entity.getModelo3d());
        domain.setEstado(entity.getEstado());
        domain.setFechaCreacion(entity.getFecCrea());
        domain.setIdMueble(entity.getIdMue());
        return domain;
    }

    public static GeneracionIAEntity toEntity(GeneracionIA domain) {
        if (domain == null) return null;
        GeneracionIAEntity entity = new GeneracionIAEntity();
        entity.setIdGen(domain.getId());
        entity.setNomMue(domain.getNombreMueble());
        entity.setImgsRef(domain.getImagenesReferencia());
        entity.setModelo3d(domain.getModelo3dUrl());
        entity.setEstado(domain.getEstado());
        entity.setFecCrea(domain.getFechaCreacion());
        entity.setIdMue(domain.getIdMueble());
        return entity;
    }
}
