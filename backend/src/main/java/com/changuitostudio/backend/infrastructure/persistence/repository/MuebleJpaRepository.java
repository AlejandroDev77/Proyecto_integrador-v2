package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.MuebleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.Optional;


@Repository
public interface MuebleJpaRepository extends JpaRepository<MuebleEntity, Long>, JpaSpecificationExecutor<MuebleEntity> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<MuebleEntity> findLockedByIdMue(Long idMue);
}
