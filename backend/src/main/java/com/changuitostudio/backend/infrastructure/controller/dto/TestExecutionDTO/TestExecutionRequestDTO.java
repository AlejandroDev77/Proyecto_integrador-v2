package com.changuitostudio.backend.infrastructure.controller.dto.TestExecutionDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.UUID;

@Data
public class TestExecutionRequestDTO {
    @JsonProperty("suiteId")
    private UUID suiteId;
}