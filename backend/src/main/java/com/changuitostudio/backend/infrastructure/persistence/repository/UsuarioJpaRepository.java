package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio Spring Data JPA con soporte para Specifications (filtros
 * dinÃ¡micos).
 */
@Repository
public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long>,
        JpaSpecificationExecutor<UsuarioEntity> {

    boolean existsByCodUsu(String codUsu);

    Optional<UsuarioEntity> findByNomUsu(String nomUsu);

    boolean existsByNomUsu(String nomUsu);

    Optional<UsuarioEntity> findByEmailUsu(String emailUsu);

    boolean existsByEmailUsu(String emailUsu);
}

