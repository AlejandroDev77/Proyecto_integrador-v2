package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleProduccionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleProduccionJpaRepository extends JpaRepository<DetalleProduccionEntity, Long>, JpaSpecificationExecutor<DetalleProduccionEntity> {
    
    /**
     * Verifica si existe un detalle de producción con el código especificado
     */
    boolean existsByCodDetPro(String codDetPro);
}
