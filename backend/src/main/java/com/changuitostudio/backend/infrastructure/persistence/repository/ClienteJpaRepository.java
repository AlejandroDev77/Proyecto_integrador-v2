package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.ClienteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteJpaRepository extends JpaRepository<ClienteEntity, Long>, JpaSpecificationExecutor<ClienteEntity> {
    Optional<ClienteEntity> findByUsuarioIdUsu(Long idUsu);
}
