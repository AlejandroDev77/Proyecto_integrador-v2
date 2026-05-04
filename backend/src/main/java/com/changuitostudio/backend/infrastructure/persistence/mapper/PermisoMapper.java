package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Permiso;
import com.changuitostudio.backend.infrastructure.persistence.entity.PermisoEntity;

import org.springframework.stereotype.Component;


@Component
public class PermisoMapper {

    
    public Permiso toDomain(PermisoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Permiso(
                entity.getIdPermiso(),
                entity.getNombre(),
                entity.getDescripcion()
        );
    }

    
    public PermisoEntity toEntity(Permiso domain) {
        if (domain == null) {
            return null;
        }
        PermisoEntity entity = new PermisoEntity();
        entity.setIdPermiso(domain.getId());
        entity.setNombre(domain.getNomPermiso());
        entity.setDescripcion(domain.getDescripcion());
        return entity;
    }
}

