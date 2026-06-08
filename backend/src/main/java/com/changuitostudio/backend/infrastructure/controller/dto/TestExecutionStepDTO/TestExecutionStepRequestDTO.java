package com.changuitostudio.backend.infrastructure.controller.dto.TestExecutionStepDTO;

import lombok.Data;
import java.util.UUID;

@Data
public class TestExecutionStepRequestDTO {
    private UUID executionId;
    private UUID caseId;
    private String resultadoEsperado;
    private String resultadoObtenido;
    private String estado; // pass | fail | pendiente
    private String observaciones;
    private String screenshotPath;
    private Integer tiempoMs;
}