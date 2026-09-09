package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduccionJpaRepository extends JpaRepository<ProduccionEntity, Long>, JpaSpecificationExecutor<ProduccionEntity> {
    
    /**
     * Verifica si existe una producción con el código especificado
     */
    boolean existsByCodPro(String codPro);

    @Query("SELECT p FROM ProduccionEntity p WHERE p.cotizacion.cliente.id = :clienteId OR p.venta.cliente.id = :clienteId")
    Page<ProduccionEntity> findByClienteId(@Param("clienteId") Long clienteId, Pageable pageable);
}
