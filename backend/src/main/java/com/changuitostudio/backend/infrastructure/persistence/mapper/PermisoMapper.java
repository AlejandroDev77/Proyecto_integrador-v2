package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Permiso;
import com.changuitostudio.backend.infrastructure.persistence.entity.PermisoEntity;

import org.springframework.stereotype.Component;

/**
 * âœ… Mapper â€” Convierte entre Domain Model (Permiso) y JPA Entity (PermisoEntity)
 * 
 * PATRÃ“N: Two-way conversion
 * - toDomain(): Entity â†’ Domain Model (desde BD)
 * - toEntity(): Domain Model â†’ Entity (para guardar en BD)
 */
@Component
public class PermisoMapper {

    /**
     * JPA Entity â†’ Domain Model
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
     * Domain Model â†’ JPA Entity
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

