package com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio Spring Data JPA con soporte para Specifications (filtros
 * dinámicos).
 */
@Repository
public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long>,
        JpaSpecificationExecutor<UsuarioEntity> {

    boolean existsByCodUsu(String codUsu);

    Optional<UsuarioEntity> findByNomUsu(String nomUsu);

    boolean existsByNomUsu(String nomUsu);

    boolean existsByEmailUsu(String emailUsu);
}
