package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.TestExecutionStepEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TestExecutionStepJpaRepository extends JpaRepository<TestExecutionStepEntity, UUID> {
    List<TestExecutionStepEntity> findByExecutionIdOrderByEjecutadoEn(UUID executionId);
}