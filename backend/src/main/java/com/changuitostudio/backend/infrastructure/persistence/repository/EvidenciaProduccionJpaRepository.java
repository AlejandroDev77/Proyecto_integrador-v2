package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.EvidenciaProduccionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EvidenciaProduccionJpaRepository extends JpaRepository<EvidenciaProduccionEntity, Long>, JpaSpecificationExecutor<EvidenciaProduccionEntity> {
    boolean existsByCodEvi(String codEvi);
}
