package com.changuitostudio.backend.infrastructure.controller.dto.TestExecutionDTO;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class TestExecutionResponseDTO {
    private UUID id;
    private UUID suiteId;
    private String estado;
    private LocalDateTime iniciadoEn;
    private LocalDateTime finalizadoEn;
    private LocalDateTime creadoEn;
}