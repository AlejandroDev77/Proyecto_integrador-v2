package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCompraEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleCompraJpaRepository extends JpaRepository<DetalleCompraEntity, Long>, JpaSpecificationExecutor<DetalleCompraEntity> {
    
    /**
     * Verifica si existe un detalle de compra con el código especificado
     */
    boolean existsByCodDetComp(String codDetComp);
}
