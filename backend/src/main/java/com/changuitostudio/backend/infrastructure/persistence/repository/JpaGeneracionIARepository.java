package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.GeneracionIAEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaGeneracionIARepository extends JpaRepository<GeneracionIAEntity, Long>, JpaSpecificationExecutor<GeneracionIAEntity> {
}
