package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.repository.AuditLogRepository;
import com.changuitostudio.backend.domain.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ManageAuditLogUseCase {

    private final AuditLogRepository auditLogRepository;

    public ManageAuditLogUseCase(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public PageResult<AuditLog> listLogs(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        
        Page<AuditLog> resultPage;
        if (search != null && !search.trim().isEmpty()) {
            resultPage = auditLogRepository.findBySearchTerm(search, pageable);
        } else {
            resultPage = auditLogRepository.findAll(pageable);
        }

        return new PageResult<>(
            resultPage.getContent(),
            resultPage.getNumber() + 1,
            resultPage.getSize(),
            resultPage.getTotalElements()
        );
    }
}
