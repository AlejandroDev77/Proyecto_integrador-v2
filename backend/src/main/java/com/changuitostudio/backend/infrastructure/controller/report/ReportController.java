package com.changuitostudio.backend.infrastructure.controller.report;

import com.changuitostudio.backend.application.dto.dashboard.DashboardRequest;
import com.changuitostudio.backend.application.dto.dashboard.DashboardResponse;
import com.changuitostudio.backend.application.usecase.dashboard.GetDashboardDataUseCase;
import com.changuitostudio.backend.infrastructure.service.report.PdfReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Year;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReportController {

    private final GetDashboardDataUseCase getDashboardDataUseCase;
    private final PdfReportService pdfReportService;

    @GetMapping("/dashboard/pdf")
    public ResponseEntity<byte[]> downloadDashboardPdf(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        if (year == null) {
            year = Year.now().getValue();
        }
        
        DashboardRequest request = DashboardRequest.builder()
                .year(year)
                .month(month != null ? month : LocalDate.now().getMonthValue())
                .build();

        // 1. Obtener datos reales del dashboard
        DashboardResponse data = getDashboardDataUseCase.execute(request);

        // 2. Generar el PDF en bytes
        byte[] pdfBytes = pdfReportService.generateDashboardPdf(data, year, month);

        if (pdfBytes.length == 0) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        // 3. Preparar los headers para que el navegador descargue el archivo
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Reporte_Operaciones_" + year + "_" + (month != null ? month : "") + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
