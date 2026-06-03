package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.TestStepResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TestStepResultJpaRepository extends JpaRepository<TestStepResultEntity, UUID> {
    List<TestStepResultEntity> findByExecutionIdOrderByPaso(UUID executionId);
    List<TestStepResultEntity> findByTestCaseIdOrderByPaso(UUID testCaseId);
}