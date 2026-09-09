package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageAuditLogUseCase;
import com.changuitostudio.backend.domain.model.AuditLog;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
public class AuditLogController {

    private final ManageAuditLogUseCase manageAuditLogUseCase;

    public AuditLogController(ManageAuditLogUseCase manageAuditLogUseCase) {
        this.manageAuditLogUseCase = manageAuditLogUseCase;
    }

    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer per_page,
            @RequestParam(required = false) String search) {

        PageResult<AuditLog> resultado = manageAuditLogUseCase.listLogs(page, per_page, search);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", resultado.getContent());
        response.put("page", resultado.getPage());
        response.put("size", resultado.getSize());
        response.put("totalElements", resultado.getTotalElements());
        response.put("totalPages", resultado.getTotalPages());

        return ResponseEntity.ok(response);
    }
}
