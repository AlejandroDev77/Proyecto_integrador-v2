package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Material;
import com.changuitostudio.backend.infrastructure.persistence.entity.MaterialEntity;

public class MaterialMapper {

    public static Material toDomain(MaterialEntity entity) {
        if (entity == null) return null;
        Material domain = new Material();
        domain.setId(entity.getId());
        domain.setNomMat(entity.getNomMat());
        domain.setDescMat(entity.getDescMat());
        domain.setStockMat(entity.getStockMat());
        domain.setStockMin(entity.getStockMin());
        domain.setUnidadMedida(entity.getUnidadMedida());
        domain.setCostoMat(entity.getCostoMat());
        domain.setImgMat(entity.getImgMat());
        domain.setEstMat(entity.getEstMat());
        domain.setCodMat(entity.getCodMat());
        return domain;
    }

    public static MaterialEntity toEntity(Material domain) {
        if (domain == null) return null;
        MaterialEntity entity = new MaterialEntity();
        entity.setId(domain.getId());
        entity.setNomMat(domain.getNomMat());
        entity.setDescMat(domain.getDescMat());
        entity.setStockMat(domain.getStockMat());
        entity.setStockMin(domain.getStockMin());
        entity.setUnidadMedida(domain.getUnidadMedida());
        entity.setCostoMat(domain.getCostoMat());
        entity.setImgMat(domain.getImgMat());
        entity.setEstMat(domain.getEstMat());
        entity.setCodMat(domain.getCodMat());
        return entity;
    }
}
