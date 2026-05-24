package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEtapaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduccionEtapaJpaRepository extends JpaRepository<ProduccionEtapaEntity, Long>, JpaSpecificationExecutor<ProduccionEtapaEntity> {
    
    /**
     * Verifica si existe una etapa de producción con el código especificado
     */
    boolean existsByCodProEta(String codProEta);
}
