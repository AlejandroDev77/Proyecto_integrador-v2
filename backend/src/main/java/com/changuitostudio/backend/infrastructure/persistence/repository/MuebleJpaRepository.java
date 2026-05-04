package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.MuebleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface MuebleJpaRepository extends JpaRepository<MuebleEntity, Long>, JpaSpecificationExecutor<MuebleEntity> {
}
