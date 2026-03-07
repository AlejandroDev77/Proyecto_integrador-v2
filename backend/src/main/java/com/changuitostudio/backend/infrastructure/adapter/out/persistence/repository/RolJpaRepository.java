package com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio Spring Data JPA para roles.
 */
@Repository
public interface RolJpaRepository extends JpaRepository<RolEntity, Long> {
}
