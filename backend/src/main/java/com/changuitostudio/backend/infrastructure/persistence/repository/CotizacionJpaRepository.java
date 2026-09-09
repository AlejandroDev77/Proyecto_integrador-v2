package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.CotizacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface CotizacionJpaRepository extends JpaRepository<CotizacionEntity, Long>, JpaSpecificationExecutor<CotizacionEntity> {
    
    /**
     * Verifica si existe una cotización con el código especificado
     */
    boolean existsByCodCot(String codCot);
    
    /**
     * Cuenta las cotizaciones por estado
     */
    long countByEstCot(String estCot);

    Page<CotizacionEntity> findByClienteId(Long clienteId, Pageable pageable);
}
