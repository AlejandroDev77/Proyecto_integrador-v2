package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.TestExecutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TestExecutionJpaRepository extends JpaRepository<TestExecutionEntity, UUID> {
    List<TestExecutionEntity> findBySuiteIdOrderByCreadoEnDesc(UUID suiteId);
}