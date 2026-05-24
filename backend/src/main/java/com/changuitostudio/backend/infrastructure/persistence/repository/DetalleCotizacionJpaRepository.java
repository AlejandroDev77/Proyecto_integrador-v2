package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCotizacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleCotizacionJpaRepository extends JpaRepository<DetalleCotizacionEntity, Long>, JpaSpecificationExecutor<DetalleCotizacionEntity> {
    
    /**
     * Verifica si existe un detalle de cotización con el código especificado
     */
    boolean existsByCodDetCot(String codDetCot);
    
    /**
     * Encuentra todos los detalles de una cotización específica
     */
    List<DetalleCotizacionEntity> findByCotizacionId(Long idCot);
}
