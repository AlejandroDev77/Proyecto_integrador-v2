package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageGeneracionIAUseCase;
import com.changuitostudio.backend.domain.model.GeneracionIA;
import com.changuitostudio.backend.infrastructure.controller.dto.GeneracionIADTO.GeneracionIADTO.GeneracionIARequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.GeneracionIADTO.GeneracionIADTO.GeneracionIAResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/generaciones-ia")
public class GeneracionIAController {

    private final ManageGeneracionIAUseCase useCase;

    public GeneracionIAController(ManageGeneracionIAUseCase useCase) {
        this.useCase = useCase;
    }

    @GetMapping
    public ResponseEntity<?> index(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer per_page,
            @RequestParam(required = false, defaultValue = "") String sort,
            @RequestParam Map<String, String> allParams) {

        Map<String, String> filters = new HashMap<>();
        allParams.forEach((key, value) -> {
            if (key.startsWith("filter[") && key.endsWith("]")) {
                String filterName = key.substring(7, key.length() - 1);
                filters.put(filterName, value);
            }
        });

        int currentPage = (page != null) ? page : 1;
        int size = (per_page != null) ? per_page : 20;

        PageResult<GeneracionIA> resultado = useCase.listar(currentPage, size, filters, sort);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("data", resultado.getContent().stream().map(this::toResponseDTO).toList());
        response.put("current_page", resultado.getPage());
        response.put("per_page", resultado.getSize());
        response.put("total", resultado.getTotalElements());
        response.put("last_page", resultado.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<GeneracionIAResponseDTO> store(@Valid @RequestBody GeneracionIARequestDTO request) {
        GeneracionIA dominio = new GeneracionIA();
        dominio.setNombreMueble(request.getNom_mue());
        dominio.setImagenesReferencia(request.getImgs_ref());
        dominio.setEstado(request.getEstado());
        dominio.setIdMueble(request.getId_mue());
        
        GeneracionIA creado = useCase.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(creado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeneracionIAResponseDTO> show(@PathVariable Long id) {
        return useCase.obtenerPorId(id)
                .map(gen -> ResponseEntity.ok(toResponseDTO(gen)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeneracionIAResponseDTO> update(@PathVariable Long id, @Valid @RequestBody GeneracionIARequestDTO request) {
        GeneracionIA dominio = new GeneracionIA();
        dominio.setNombreMueble(request.getNom_mue());
        dominio.setImagenesReferencia(request.getImgs_ref());
        dominio.setEstado(request.getEstado());
        dominio.setIdMueble(request.getId_mue());
        dominio.setModelo3dUrl(request.getModelo_3d_url());

        GeneracionIA actualizado = useCase.actualizar(id, dominio);
        return ResponseEntity.ok(toResponseDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        useCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private GeneracionIAResponseDTO toResponseDTO(GeneracionIA gen) {
        return new GeneracionIAResponseDTO(
                gen.getId(),
                gen.getNombreMueble(),
                gen.getImagenesReferencia(),
                gen.getModelo3dUrl(),
                gen.getEstado(),
                gen.getFechaCreacion(),
                gen.getIdMueble()
        );
    }
}
