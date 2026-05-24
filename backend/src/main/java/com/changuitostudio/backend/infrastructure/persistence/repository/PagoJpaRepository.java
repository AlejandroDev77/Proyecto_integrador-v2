package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.PagoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoJpaRepository extends JpaRepository<PagoEntity, Long>, JpaSpecificationExecutor<PagoEntity> {
    
    /**
     * Verifica si existe un pago con el código especificado
     */
    boolean existsByCodPag(String codPag);
}
