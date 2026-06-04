package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduccionJpaRepository extends JpaRepository<ProduccionEntity, Long>, JpaSpecificationExecutor<ProduccionEntity> {
    
    /**
     * Verifica si existe una producción con el código especificado
     */
    boolean existsByCodPro(String codPro);
}
