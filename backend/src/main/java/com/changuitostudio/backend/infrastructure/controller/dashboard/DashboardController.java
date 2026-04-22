package com.changuitostudio.backend.infrastructure.controller.dashboard;

import com.changuitostudio.backend.application.dto.dashboard.DashboardRequest;
import com.changuitostudio.backend.application.dto.dashboard.DashboardResponse;
import com.changuitostudio.backend.application.usecase.dashboard.GetDashboardDataUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Year;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final GetDashboardDataUseCase getDashboardDataUseCase;

    @GetMapping("/all")
    public ResponseEntity<DashboardResponse> getAllDashboardData(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(name = "start_date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "end_date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "month_filter", required = false) String monthFilter
    ) {
        if (year == null) {
            year = Year.now().getValue();
        }
        
        DashboardRequest request = DashboardRequest.builder()
                .year(year)
                .month(month != null ? month : LocalDate.now().getMonthValue())
                .startDate(startDate)
                .endDate(endDate)
                .monthFilter(monthFilter)
                .build();

        DashboardResponse response = getDashboardDataUseCase.execute(request);
        return ResponseEntity.ok(response);
    }
}
