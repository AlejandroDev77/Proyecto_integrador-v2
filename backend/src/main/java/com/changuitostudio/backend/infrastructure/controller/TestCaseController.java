package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.infrastructure.controller.dto.TestCaseDTO.TestCaseRequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.TestCaseDTO.TestCaseResponseDTO;
import com.changuitostudio.backend.infrastructure.persistence.entity.TestCaseEntity;
import com.changuitostudio.backend.infrastructure.persistence.repository.TestCaseJpaRepository;
import com.changuitostudio.backend.infrastructure.persistence.repository.TestSuiteJpaRepository;
import com.changuitostudio.backend.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/qa/cases")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestCaseJpaRepository testCaseJpaRepository;
    private final TestSuiteJpaRepository testSuiteJpaRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<TestCaseResponseDTO>> crear(@RequestBody TestCaseRequestDTO request) {
        return testSuiteJpaRepository.findById(request.getSuiteId())
                .map(suite -> {
                    TestCaseEntity entity = TestCaseEntity.builder()
                            .suite(suite)
                            .nombre(request.getNombre())
                            .descripcion(request.getDescripcion())
                            .gherkin(request.getGherkin())
                            .orden(request.getOrden())
                            .build();
                    TestCaseEntity saved = testCaseJpaRepository.save(entity);
                    return ResponseEntity.ok(ApiResponse.success(toResponse(saved)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/suite/{suiteId}")
    public ResponseEntity<ApiResponse<List<TestCaseResponseDTO>>> listarPorSuite(@PathVariable UUID suiteId) {
        List<TestCaseResponseDTO> lista = testCaseJpaRepository
                .findBySuiteIdOrderByOrden(suiteId)
                .stream().map(this::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.success(lista));
    }

    private TestCaseResponseDTO toResponse(TestCaseEntity e) {
        return TestCaseResponseDTO.builder()
                .id(e.getId())
                .suiteId(e.getSuite().getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .gherkin(e.getGherkin())
                .orden(e.getOrden())
                .creadoEn(e.getCreadoEn())
                .build();
    }
}