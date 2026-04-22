package com.changuitostudio.backend.application.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardRequest {
    private Integer year;
    private Integer month;
    private LocalDate startDate;
    private LocalDate endDate;
    private String monthFilter; // 'specific' or null/other
}
