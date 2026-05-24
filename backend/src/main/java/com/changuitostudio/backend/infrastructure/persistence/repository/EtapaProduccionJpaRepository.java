package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.EtapaProduccionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EtapaProduccionJpaRepository extends JpaRepository<EtapaProduccionEntity, Long>, JpaSpecificationExecutor<EtapaProduccionEntity> {
}
