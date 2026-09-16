package com.changuitostudio.backend.application.repository;

import com.changuitostudio.backend.domain.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:search IS NULL OR LOWER(COALESCE(a.codUsu, '')) LIKE CONCAT('%', :search, '%') " +
           "OR LOWER(COALESCE(a.tableName, '')) LIKE CONCAT('%', :search, '%') " +
           "OR LOWER(COALESCE(a.action, '')) LIKE CONCAT('%', :search, '%') " +
           "OR str(a.recordId) LIKE CONCAT('%', :search, '%')) " +
           "AND (:action IS NULL OR a.action = :action) " +
           "AND (:tableName IS NULL OR a.tableName = :tableName) " +
           "AND (:fromDate IS NULL OR a.createdAt >= :fromDate) " +
           "AND (:toDate IS NULL OR a.createdAt < :toDate) " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> findFiltered(
            @Param("search") String search,
            @Param("action") String action,
            @Param("tableName") String tableName,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:search IS NULL OR LOWER(COALESCE(a.codUsu, '')) LIKE CONCAT('%', :search, '%') " +
           "OR LOWER(COALESCE(a.tableName, '')) LIKE CONCAT('%', :search, '%') " +
           "OR LOWER(COALESCE(a.action, '')) LIKE CONCAT('%', :search, '%') " +
           "OR str(a.recordId) LIKE CONCAT('%', :search, '%')) " +
           "AND (:action IS NULL OR a.action = :action) " +
           "AND (:tableName IS NULL OR a.tableName = :tableName) " +
           "AND (:fromDate IS NULL OR a.createdAt >= :fromDate) " +
           "AND (:toDate IS NULL OR a.createdAt < :toDate) " +
           "ORDER BY a.createdAt DESC")
    List<AuditLog> findAllFiltered(
            @Param("search") String search,
            @Param("action") String action,
            @Param("tableName") String tableName,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

}
