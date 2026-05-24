package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleDevolucionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleDevolucionJpaRepository extends JpaRepository<DetalleDevolucionEntity, Long>, JpaSpecificationExecutor<DetalleDevolucionEntity> {
    
    /**
     * Verifica si existe un detalle de devolución con el código especificado
     */
    boolean existsByCodDetDev(String codDetDev);
}
