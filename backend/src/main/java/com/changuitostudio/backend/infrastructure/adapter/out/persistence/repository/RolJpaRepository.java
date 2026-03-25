package com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * ✅ Repositorio Spring Data JPA para roles.
 * 
 * IMPORTANTE: Extiende JpaSpecificationExecutor para soportar búsquedas
 * con Specifications (filtros dinámicos) como en RolPersistencePort.buscarTodos()
 */
@Repository
public interface RolJpaRepository extends JpaRepository<RolEntity, Long>, JpaSpecificationExecutor<RolEntity> {
}
