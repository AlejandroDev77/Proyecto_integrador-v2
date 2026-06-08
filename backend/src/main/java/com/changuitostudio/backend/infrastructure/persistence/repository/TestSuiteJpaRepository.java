package com.changuitostudio.backend.infrastructure.persistence.repository;

import com.changuitostudio.backend.infrastructure.persistence.entity.TestSuiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TestSuiteJpaRepository extends JpaRepository<TestSuiteEntity, UUID> {
}