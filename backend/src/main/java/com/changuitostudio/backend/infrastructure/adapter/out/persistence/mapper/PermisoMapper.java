package com.changuitostudio.backend.infrastructure.adapter.out.persistence.mapper;

import com.changuitostudio.backend.domain.model.Permiso;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.PermisoEntity;

import org.springframework.stereotype.Component;

/**
 * ✅ Mapper — Convierte entre Domain Model (Permiso) y JPA Entity (PermisoEntity)
 * 
 * PATRÓN: Two-way conversion
 * - toDomain(): Entity → Domain Model (desde BD)
 * - toEntity(): Domain Model → Entity (para guardar en BD)
 */
@Component
public class PermisoMapper {

    /**
     * JPA Entity → Domain Model
     */
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

    /**
     * Domain Model → JPA Entity
     */
    public PermisoEntity toEntity(Permiso domain) {
        if (domain == null) {
            return null;
        }
        PermisoEntity entity = new PermisoEntity();
        entity.setIdPermiso(domain.getId());
        entity.setNombre(domain.getNombre());
        entity.setDescripcion(domain.getDescripcion());
        return entity;
    }
}
