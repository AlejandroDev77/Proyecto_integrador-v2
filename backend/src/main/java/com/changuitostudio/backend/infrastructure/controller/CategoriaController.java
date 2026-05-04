package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageCategoriaUseCase;
import com.changuitostudio.backend.domain.model.Categoria;
import com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO.CategoriaRequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO.CategoriaResponseDTO;
import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller REST para gestión de categorías.
 * Solo inyecta el Use Case ManageCategoriaUseCase.
 */
@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {

    private final ManageCategoriaUseCase manageCategoriaUseCase;

    
    public CategoriaController(ManageCategoriaUseCase manageCategoriaUseCase) {
        this.manageCategoriaUseCase = manageCategoriaUseCase;
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

        if (page == null && per_page == null) {
            PageResult<Categoria> allData = manageCategoriaUseCase.listarCategorias(1, Integer.MAX_VALUE, filters, sort);
            return ResponseEntity.ok(allData.getContent().stream().map(this::toResponseDTO).toList());
        }

        int currentPage = (page != null) ? page : 1;
        int size = (per_page != null) ? per_page : 20;

        PageResult<Categoria> resultado = manageCategoriaUseCase.listarCategorias(currentPage, size, filters, sort);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("data", resultado.getContent().stream().map(this::toResponseDTO).toList());
        response.put("current_page", resultado.getPage());
        response.put("per_page", resultado.getSize());
        response.put("total", resultado.getTotalElements());
        response.put("last_page", resultado.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> show(@PathVariable Long id) {
        return manageCategoriaUseCase.obtenerPorId(id)
                .map(categoria -> ResponseEntity.ok(toResponseDTO(categoria)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> store(@Valid @RequestBody CategoriaRequestDTO request) {
        Categoria dominio = new Categoria();
        dominio.setNombre(request.getNom_cat());
        dominio.setEstado(request.getEst_cat() != null ? request.getEst_cat() : true);
        Categoria creado = manageCategoriaUseCase.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> update(@PathVariable Long id,
            @Valid @RequestBody CategoriaRequestDTO request) {
        Categoria dominio = new Categoria();
        dominio.setNombre(request.getNom_cat());
        dominio.setEstado(request.getEst_cat());
        Categoria actualizado = manageCategoriaUseCase.actualizar(id, dominio);
        return ResponseEntity.ok(toResponseDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        manageCategoriaUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private CategoriaResponseDTO toResponseDTO(Categoria categoria) {
        return new CategoriaResponseDTO(categoria.getId(), categoria.getNombre(), categoria.getEstado());
    }
}
