package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.PermisoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * ✅ Repositorio Spring Data JPA para permisos.
 * 
 * IMPORTANTE: Extiende JpaSpecificationExecutor para soportar búsquedas
 * con Specifications (filtros dinámicos) como en PermisoRepository.buscarTodos()
 */
@Repository
public interface PermisoJpaRepository extends JpaRepository<PermisoEntity, Long>, JpaSpecificationExecutor<PermisoEntity> {
}
