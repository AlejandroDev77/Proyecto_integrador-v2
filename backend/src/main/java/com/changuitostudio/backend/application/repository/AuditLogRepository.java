package com.changuitostudio.backend.application.repository;

import com.changuitostudio.backend.domain.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "LOWER(a.codUsu) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.tableName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> findBySearchTerm(@Param("search") String search, Pageable pageable);

}
