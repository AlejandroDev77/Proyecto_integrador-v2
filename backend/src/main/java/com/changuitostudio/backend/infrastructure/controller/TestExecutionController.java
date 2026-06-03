package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.infrastructure.controller.dto.TestExecutionDTO.*;
import com.changuitostudio.backend.infrastructure.controller.dto.TestExecutionStepDTO.*;
import com.changuitostudio.backend.infrastructure.persistence.entity.*;
import com.changuitostudio.backend.infrastructure.persistence.repository.*;
import com.changuitostudio.backend.infrastructure.service.QaRunnerService;
import com.changuitostudio.backend.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/qa/executions")
@RequiredArgsConstructor
public class TestExecutionController {

    private final TestExecutionJpaRepository executionRepo;
    private final TestExecutionStepJpaRepository stepRepo;
    private final TestSuiteJpaRepository suiteRepo;
    private final TestCaseJpaRepository caseRepo;
    private final QaRunnerService qaRunnerService;

    // Crear ejecución
    @PostMapping
    public ResponseEntity<ApiResponse<TestExecutionResponseDTO>> crear(@RequestBody TestExecutionRequestDTO request) {
        return suiteRepo.findById(request.getSuiteId())
                .map(suite -> {
                    TestExecutionEntity entity = TestExecutionEntity.builder()
                            .suite(suite)
                            .estado("en_proceso")
                            .iniciadoEn(LocalDateTime.now())
                            .build();
                    TestExecutionEntity saved = executionRepo.save(entity);
                    return ResponseEntity.ok(ApiResponse.success(toResponse(saved)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Listar ejecuciones por suite
    @GetMapping("/suite/{suiteId}")
    public ResponseEntity<ApiResponse<List<TestExecutionResponseDTO>>> listarPorSuite(@PathVariable UUID suiteId) {
        List<TestExecutionResponseDTO> lista = executionRepo
                .findBySuiteIdOrderByCreadoEnDesc(suiteId)
                .stream().map(this::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.success(lista));
    }

    // Marcar ejecución como completada
    @PatchMapping("/{id}/completar")
    public ResponseEntity<ApiResponse<TestExecutionResponseDTO>> completar(@PathVariable UUID id) {
        return executionRepo.findById(id)
                .map(e -> {
                    e.setEstado("completado");
                    e.setFinalizadoEn(LocalDateTime.now());
                    return ResponseEntity.ok(ApiResponse.success(toResponse(executionRepo.save(e))));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Registrar resultado de un paso
    @PostMapping("/steps")
    public ResponseEntity<ApiResponse<TestExecutionStepResponseDTO>> registrarStep(
            @RequestBody TestExecutionStepRequestDTO request) {

        var execution = executionRepo.findById(request.getExecutionId()).orElse(null);
        var testCase = caseRepo.findById(request.getCaseId()).orElse(null);

        if (execution == null || testCase == null)
            return ResponseEntity.notFound().build();

        TestExecutionStepEntity step = TestExecutionStepEntity.builder()
                .execution(execution)
                .testCase(testCase)
                .resultadoEsperado(request.getResultadoEsperado())
                .resultadoObtenido(request.getResultadoObtenido())
                .estado(request.getEstado())
                .observaciones(request.getObservaciones())
                .screenshotPath(request.getScreenshotPath())
                .tiempoMs(request.getTiempoMs())
                .build();

        TestExecutionStepEntity saved = stepRepo.save(step);
        return ResponseEntity.ok(ApiResponse.success(toStepResponse(saved)));
    }

    // Listar steps de una ejecución
    @GetMapping("/{executionId}/steps")
    public ResponseEntity<ApiResponse<List<TestExecutionStepResponseDTO>>> listarSteps(
            @PathVariable UUID executionId) {
        List<TestExecutionStepResponseDTO> lista = stepRepo
                .findByExecutionIdOrderByEjecutadoEn(executionId)
                .stream().map(this::toStepResponse).toList();
        return ResponseEntity.ok(ApiResponse.success(lista));
    }

    private TestExecutionResponseDTO toResponse(TestExecutionEntity e) {
        return TestExecutionResponseDTO.builder()
                .id(e.getId())
                .suiteId(e.getSuite().getId())
                .estado(e.getEstado())
                .iniciadoEn(e.getIniciadoEn())
                .finalizadoEn(e.getFinalizadoEn())
                .creadoEn(e.getCreadoEn())
                .build();
    }

    private TestExecutionStepResponseDTO toStepResponse(TestExecutionStepEntity e) {
        return TestExecutionStepResponseDTO.builder()
                .id(e.getId())
                .executionId(e.getExecution().getId())
                .caseId(e.getTestCase().getId())
                .resultadoEsperado(e.getResultadoEsperado())
                .resultadoObtenido(e.getResultadoObtenido())
                .estado(e.getEstado())
                .observaciones(e.getObservaciones())
                .screenshotPath(e.getScreenshotPath())
                .tiempoMs(e.getTiempoMs())
                .ejecutadoEn(e.getEjecutadoEn())
                .build();
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<ApiResponse<Map<String, Object>>> ejecutar(
            @PathVariable UUID id,
            @RequestParam String baseUrl,
            @RequestBody(required = false) Map<String, Object> body) {

        Map<String, String> credenciales = new HashMap<>();
        if (body != null && body.containsKey("credenciales")) {
            Map<String, String> creds = (Map<String, String>) body.get("credenciales");
            if (creds != null)
                credenciales = creds;
        }

        final Map<String, String> finalCredenciales = credenciales;

        return executionRepo.findById(id)
                .map(execution -> {
                    execution.setEstado("en_proceso");
                    execution.setIniciadoEn(LocalDateTime.now());
                    executionRepo.save(execution);
                    Map<String, Object> resultado = qaRunnerService.ejecutarSuite(execution, baseUrl,
                            finalCredenciales);
                    return ResponseEntity.ok(ApiResponse.success(resultado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

}