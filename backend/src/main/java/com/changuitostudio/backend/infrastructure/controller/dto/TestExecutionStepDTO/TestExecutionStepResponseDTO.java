package com.changuitostudio.backend.infrastructure.controller.dto.TestExecutionStepDTO;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class TestExecutionStepResponseDTO {
    private UUID id;
    private UUID executionId;
    private UUID caseId;
    private String resultadoEsperado;
    private String resultadoObtenido;
    private String estado;
    private String observaciones;
    private String screenshotPath;
    private Integer tiempoMs;
    private LocalDateTime ejecutadoEn;
}