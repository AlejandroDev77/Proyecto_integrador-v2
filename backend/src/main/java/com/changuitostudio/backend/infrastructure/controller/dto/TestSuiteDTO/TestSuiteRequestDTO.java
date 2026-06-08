package com.changuitostudio.backend.infrastructure.controller.dto.TestSuiteDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TestSuiteRequestDTO {
    private String nombre;
    private String descripcion;
    private String tipo;        // regresion | unitario | integracion | e2e | sistema
    @JsonProperty("emailDestino")
    private String emailDestino;
}