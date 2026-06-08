package com.changuitostudio.backend.infrastructure.controller.dto.TestCaseDTO;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class TestCaseResponseDTO {
    private UUID id;
    private UUID suiteId;
    private String nombre;
    private String descripcion;
    private String gherkin;
    private Integer orden;
    private LocalDateTime creadoEn;
}