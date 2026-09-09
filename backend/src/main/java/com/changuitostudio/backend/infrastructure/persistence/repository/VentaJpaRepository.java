package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.VentaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface VentaJpaRepository extends JpaRepository<VentaEntity, Long>, JpaSpecificationExecutor<VentaEntity> {
    
    /**
     * Verifica si existe una venta con el código especificado
     */
    boolean existsByCodVen(String codVen);
    
    /**
     * Cuenta las ventas realizadas en una fecha específica
     */
    long countByFecVen(LocalDate fecVen);

    Page<VentaEntity> findByClienteId(Long clienteId, Pageable pageable);
}
