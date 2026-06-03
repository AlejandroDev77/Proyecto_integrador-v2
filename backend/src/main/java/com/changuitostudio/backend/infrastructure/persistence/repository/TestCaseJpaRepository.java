package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.TestCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TestCaseJpaRepository extends JpaRepository<TestCaseEntity, UUID> {
    List<TestCaseEntity> findBySuiteIdOrderByOrden(UUID suiteId);
}