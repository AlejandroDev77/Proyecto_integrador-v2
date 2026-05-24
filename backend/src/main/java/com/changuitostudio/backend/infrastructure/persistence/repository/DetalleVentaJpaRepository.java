package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleVentaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleVentaJpaRepository extends JpaRepository<DetalleVentaEntity, Long>, JpaSpecificationExecutor<DetalleVentaEntity> {
    
    /**
     * Verifica si existe un detalle de venta con el código especificado
     */
    boolean existsByCodDetVen(String codDetVen);
}
