package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.repository.AuditLogRepository;
import com.changuitostudio.backend.domain.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ManageAuditLogUseCase {

    private final AuditLogRepository auditLogRepository;

    public ManageAuditLogUseCase(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public PageResult<AuditLog> listLogs(int page, int size, String search, String action, String tableName,
            LocalDate fromDate, LocalDate toDate) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        String normalizedSearch = normalizeSearch(search);
        String normalizedAction = normalize(action);
        String normalizedTableName = normalize(tableName);
        Page<AuditLog> resultPage = normalizedSearch == null && normalizedAction == null && normalizedTableName == null
                && fromDate == null && toDate == null
                ? auditLogRepository.findAll(pageable)
                : auditLogRepository.findFiltered(
                        normalizedSearch, normalizedAction, normalizedTableName, startOfDay(fromDate), startOfNextDay(toDate), pageable);

        return new PageResult<>(
            resultPage.getContent(),
            resultPage.getNumber() + 1,
            resultPage.getSize(),
            resultPage.getTotalElements()
        );
    }

    public List<AuditLog> exportLogs(String search, String action, String tableName, LocalDate fromDate, LocalDate toDate) {
        String normalizedSearch = normalizeSearch(search);
        String normalizedAction = normalize(action);
        String normalizedTableName = normalize(tableName);
        if (normalizedSearch == null && normalizedAction == null && normalizedTableName == null && fromDate == null && toDate == null) {
            return auditLogRepository.findAll(Sort.by("createdAt").descending());
        }
        return auditLogRepository.findAllFiltered(
                normalizedSearch, normalizedAction, normalizedTableName, startOfDay(fromDate), startOfNextDay(toDate));
    }

    private String normalize(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private String normalizeSearch(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toLowerCase();
    }

    private LocalDateTime startOfDay(LocalDate date) {
        return date == null ? null : date.atStartOfDay();
    }

    private LocalDateTime startOfNextDay(LocalDate date) {
        return date == null ? null : date.plusDays(1).atStartOfDay();
    }
}
