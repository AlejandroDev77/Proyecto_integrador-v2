package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.VerificationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationTokenJpaRepository extends JpaRepository<VerificationTokenEntity, Long> {
    
    Optional<VerificationTokenEntity> findByToken(String token);
    
    void deleteByExpiryDateBefore(LocalDateTime now);
}

