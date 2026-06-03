package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.infrastructure.controller.dto.TestSuiteDTO.TestSuiteRequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.TestSuiteDTO.TestSuiteResponseDTO;
import com.changuitostudio.backend.infrastructure.persistence.entity.TestSuiteEntity;
import com.changuitostudio.backend.infrastructure.persistence.repository.TestSuiteJpaRepository;
import com.changuitostudio.backend.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/qa/suites")
@RequiredArgsConstructor
public class TestSuiteController {

    private final TestSuiteJpaRepository testSuiteJpaRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<TestSuiteResponseDTO>> crear(@RequestBody TestSuiteRequestDTO request) {
        TestSuiteEntity entity = TestSuiteEntity.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .tipo(request.getTipo())
                .emailDestino(request.getEmailDestino())
                .build();

        TestSuiteEntity saved = testSuiteJpaRepository.save(entity);

        return ResponseEntity.ok(ApiResponse.success(toResponse(saved)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestSuiteResponseDTO>>> listar() {
        List<TestSuiteResponseDTO> lista = testSuiteJpaRepository.findAll()
                .stream().map(this::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.success(lista));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestSuiteResponseDTO>> obtener(@PathVariable UUID id) {
        return testSuiteJpaRepository.findById(id)
                .map(e -> ResponseEntity.ok(ApiResponse.success(toResponse(e))))
                .orElse(ResponseEntity.notFound().build());
    }

    private TestSuiteResponseDTO toResponse(TestSuiteEntity e) {
        return TestSuiteResponseDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .tipo(e.getTipo())
                .emailDestino(e.getEmailDestino())
                .creadoEn(e.getCreadoEn())
                .build();
    }
}