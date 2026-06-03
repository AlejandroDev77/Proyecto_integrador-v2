package com.changuitostudio.backend.infrastructure.controller.dto.TestCaseDTO;

import lombok.Data;
import java.util.UUID;

@Data
public class TestCaseRequestDTO {
    private UUID suiteId;
    private String nombre;
    private String descripcion;
    private String gherkin;
    private Integer orden;
}