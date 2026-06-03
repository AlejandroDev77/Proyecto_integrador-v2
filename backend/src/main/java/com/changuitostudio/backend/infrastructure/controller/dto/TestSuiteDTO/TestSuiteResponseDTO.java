package com.changuitostudio.backend.infrastructure.controller.dto.TestSuiteDTO;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class TestSuiteResponseDTO {
    private UUID id;
    private String nombre;
    private String descripcion;
    private String tipo;
    private String emailDestino;
    private LocalDateTime creadoEn;
}