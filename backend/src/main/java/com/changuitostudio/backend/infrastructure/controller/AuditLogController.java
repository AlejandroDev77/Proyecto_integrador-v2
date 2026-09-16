package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageAuditLogUseCase;
import com.changuitostudio.backend.domain.model.AuditLog;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;
import java.time.LocalDate;
import java.util.List;

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
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String table_name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from_date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to_date) {

        PageResult<AuditLog> resultado = manageAuditLogUseCase.listLogs(page, per_page, search, action, table_name, from_date, to_date);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", resultado.getContent());
        response.put("page", resultado.getPage());
        response.put("size", resultado.getSize());
        response.put("totalElements", resultado.getTotalElements());
        response.put("totalPages", resultado.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<byte[]> export(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String table_name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from_date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to_date) {
        List<AuditLog> logs = manageAuditLogUseCase.exportLogs(search, action, table_name, from_date, to_date);
        StringBuilder csv = new StringBuilder("\uFEFFFecha,Usuario,Tabla,Registro,Acción,Valores anteriores,Valores nuevos\r\n");
        for (AuditLog log : logs) {
            csv.append(csv(log.getCreatedAt())).append(',')
                    .append(csv(log.getCodUsu())).append(',')
                    .append(csv(log.getTableName())).append(',')
                    .append(csv(log.getRecordId())).append(',')
                    .append(csv(log.getAction())).append(',')
                    .append(csv(log.getOldValues())).append(',')
                    .append(csv(log.getNewValues())).append("\r\n");
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=auditoria-logs.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    private String csv(Object value) {
        String text = value == null ? "" : String.valueOf(value);
        return "\"" + text.replace("\"", "\"\"") + "\"";
    }
}
