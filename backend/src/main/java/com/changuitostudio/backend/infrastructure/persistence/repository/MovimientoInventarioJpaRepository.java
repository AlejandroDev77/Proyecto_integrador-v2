package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.MovimientoInventarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimientoInventarioJpaRepository extends JpaRepository<MovimientoInventarioEntity, Long>, JpaSpecificationExecutor<MovimientoInventarioEntity> {
    
    /**
     * Verifica si existe un movimiento de inventario con el código especificado
     */
    boolean existsByCodMov(String codMov);
}
