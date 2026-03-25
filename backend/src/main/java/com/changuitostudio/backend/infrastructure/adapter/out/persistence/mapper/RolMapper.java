package com.changuitostudio.backend.infrastructure.adapter.out.persistence.mapper;

import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.adapter.in.web.dto.RolDTO.RolDTO;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;

import org.springframework.stereotype.Component;

/**
 * ✅ Mapper — Convierte entre Domain Model (Rol) y JPA Entity (RolEntity)
 * 💡 También crea DTOs para respuestas HTTP con permisos y pivot
 */
@Component
public class RolMapper {

    private final PermisoMapper permisoMapper;

    public RolMapper(PermisoMapper permisoMapper) {
        this.permisoMapper = permisoMapper;
    }

    /**
     * JPA Entity → Domain Model
     * ✅ Mapea la colección de PermisoEntity a Permiso
     */
    public Rol toDomain(RolEntity entity) {
        if (entity == null) {
            return null;
        }
        
        Rol domain = new Rol(entity.getIdRol(), entity.getNomRol());

        // ✅ Mapear la colección de permisos (Many-to-Many)
        if (entity.getPermisos() != null && !entity.getPermisos().isEmpty()) {
            entity.getPermisos().forEach(permisoEntity -> {
                domain.agregarPermiso(permisoMapper.toDomain(permisoEntity));
            });
        }

        return domain;
    }

    /**
     * Domain Model → JPA Entity
     * ✅ Mapea la colección de Permiso a PermisoEntity
     */
    public RolEntity toEntity(Rol domain) {
        if (domain == null) {
            return null;
        }

        RolEntity entity = new RolEntity();
        entity.setIdRol(domain.getId());
        entity.setNomRol(domain.getNomRol());

        // ✅ Mapear la colección de permisos (Many-to-Many)
        if (domain.getPermisos() != null && !domain.getPermisos().isEmpty()) {
            domain.getPermisos().forEach(permiso -> {
                entity.getPermisos().add(permisoMapper.toEntity(permiso));
            });
        }

        return entity;
    }

    /**
     * ✅ NUEVA: Entity → DTO CON permisos y pivot
     * Para respuestas HTTP tipo Laravel con estructura de pivote
     * 
     * Ejemplo de respuesta:
     * {
     *   "id_rol": 1,
     *   "nom_rol": "Administrador",
     *   "permisos": [
     *     {
     *       "id_permiso": 2,
     *       "nombre": "ver_reportes",
     *       "descripcion": "Ver reportes generales",
     *       "pivot": {
     *         "id_rol": 1,
     *         "id_permiso": 2
     *       }
     *     }
     *   ]
     * }
     */
    public RolDTO toDTO(RolEntity entity) {
        if (entity == null) {
            return null;
        }

        // ✅ Mapear permisos con pivot
        var permisosDTO = entity.getPermisos() != null 
            ? entity.getPermisos().stream()
                .map(permisoEntity -> new RolDTO.PermisoConPivotDTO(
                    permisoEntity.getIdPermiso(),
                    permisoEntity.getNombre(),
                    permisoEntity.getDescripcion(),
                    entity.getIdRol()  // ✅ idRol para el pivot
                ))
                .toList()
            : null;

        return new RolDTO(entity.getIdRol(), entity.getNomRol(), permisosDTO);
    }
}

