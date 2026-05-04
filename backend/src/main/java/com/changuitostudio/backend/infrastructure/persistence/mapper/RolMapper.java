package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.persistence.entity.RolEntity;

import org.springframework.stereotype.Component;


@Component
public class RolMapper {

    private final PermisoMapper permisoMapper;

    public RolMapper(PermisoMapper permisoMapper) {
        this.permisoMapper = permisoMapper;
    }

  
    public Rol toDomain(RolEntity entity) {
        if (entity == null) {
            return null;
        }

        Rol domain = new Rol(entity.getIdRol(), entity.getNomRol());

        if (entity.getPermisos() != null && !entity.getPermisos().isEmpty()) {
            entity.getPermisos().forEach(permisoEntity -> {
                domain.agregarPermiso(permisoMapper.toDomain(permisoEntity));
            });
        }

        return domain;
    }

   
    public RolEntity toEntity(Rol domain) {
        if (domain == null) {
            return null;
        }

        RolEntity entity = new RolEntity();
        entity.setIdRol(domain.getId());
        entity.setNomRol(domain.getNomRol());

        if (domain.getPermisos() != null && !domain.getPermisos().isEmpty()) {
            domain.getPermisos().forEach(permiso -> {
                entity.getPermisos().add(permisoMapper.toEntity(permiso));
            });
        }

        return entity;
    }
}

