package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.EmpleadoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmpleadoJpaRepository extends JpaRepository<EmpleadoEntity, Long>, JpaSpecificationExecutor<EmpleadoEntity> {
    Optional<EmpleadoEntity> findByUsuarioIdUsu(Long idUsu);
}
