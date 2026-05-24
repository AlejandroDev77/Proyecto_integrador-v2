package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.DevolucionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface DevolucionJpaRepository extends JpaRepository<DevolucionEntity, Long>, JpaSpecificationExecutor<DevolucionEntity> {
    
    /**
     * Verifica si existe una devolución con el código especificado
     */
    boolean existsByCodDev(String codDev);
    
    /**
     * Cuenta las devoluciones entre dos fechas
     */
    long countByFecDevBetween(LocalDate start, LocalDate end);
}
