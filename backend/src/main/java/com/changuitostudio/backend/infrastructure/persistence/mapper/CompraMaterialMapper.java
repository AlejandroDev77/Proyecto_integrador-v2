package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.CompraMaterial;
import com.changuitostudio.backend.infrastructure.persistence.entity.CompraMaterialEntity;

public class CompraMaterialMapper {

    public static CompraMaterial toDomain(CompraMaterialEntity entity) {
        if (entity == null) return null;
        CompraMaterial domain = new CompraMaterial();
        domain.setId(entity.getId());
        domain.setFecComp(entity.getFecComp());
        domain.setEstComp(entity.getEstComp());
        domain.setTotalComp(entity.getTotalComp());
        if (entity.getProveedor() != null) {
            domain.setProveedor(ProveedorMapper.toDomain(entity.getProveedor()));
        }
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setCodComp(entity.getCodComp());
        return domain;
    }

    public static CompraMaterialEntity toEntity(CompraMaterial domain) {
        if (domain == null) return null;
        CompraMaterialEntity entity = new CompraMaterialEntity();
        entity.setId(domain.getId());
        entity.setFecComp(domain.getFecComp());
        entity.setEstComp(domain.getEstComp());
        entity.setTotalComp(domain.getTotalComp());
        if (domain.getProveedor() != null) {
            entity.setProveedor(ProveedorMapper.toEntity(domain.getProveedor()));
        }
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setCodComp(domain.getCodComp());
        return entity;
    }
}
