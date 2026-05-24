package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.CompraMaterialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface CompraMaterialJpaRepository extends JpaRepository<CompraMaterialEntity, Long>, JpaSpecificationExecutor<CompraMaterialEntity> {
    
    /**
     * Verifica si existe una compra con el código especificado
     */
    boolean existsByCodComp(String codComp);
    
    /**
     * Cuenta las compras entre dos fechas
     */
    long countByFecCompBetween(LocalDate start, LocalDate end);
}
