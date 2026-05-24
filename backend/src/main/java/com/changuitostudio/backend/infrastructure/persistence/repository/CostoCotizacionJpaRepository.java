package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.CostoCotizacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CostoCotizacionJpaRepository extends JpaRepository<CostoCotizacionEntity, Long>, JpaSpecificationExecutor<CostoCotizacionEntity> {
}
