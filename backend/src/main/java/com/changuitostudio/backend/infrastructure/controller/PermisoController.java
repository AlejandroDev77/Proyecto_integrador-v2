package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManagePermisoUseCase;
import com.changuitostudio.backend.domain.model.Permiso;
//import com.changuitostudio.backend.infrastructure.controller.dto.PermisoDTO.PermisoDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.PermisoDTO.PermisoRequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.PermisoDTO.PermisoResponseDTO;

import jakarta.validation.Valid;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controller REST para gestión de permisos.
 * Solo inyecta el Use Case ManagePermisoUseCase.
 */
@RestController
@RequestMapping("/api/permisos")
public class PermisoController {

    private final ManagePermisoUseCase managePermisoUseCase;

    
    public PermisoController(ManagePermisoUseCase managePermisoUseCase) {
        this.managePermisoUseCase = managePermisoUseCase;
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
            PageResult<Permiso> allData = managePermisoUseCase.listarPermisos(1, Integer.MAX_VALUE, filters, sort);
            return ResponseEntity.ok(allData.getContent().stream().map(this::toResponseDTO).toList());
        }

        int currentPage = (page != null) ? page : 1;
        int size = (per_page != null) ? per_page : 20;

        PageResult<Permiso> resultado = managePermisoUseCase.listarPermisos(currentPage, size, filters, sort);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", resultado.getContent().stream().map(this::toResponseDTO).toList());
        response.put("page", resultado.getPage());
        response.put("size", resultado.getSize());
        response.put("totalElements", resultado.getTotalElements());
        response.put("totalPages", resultado.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermisoResponseDTO> show(@PathVariable Long id) {
        return managePermisoUseCase.obtenerPorId(id)
                .map(permiso -> ResponseEntity.ok(toResponseDTO(permiso)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PermisoResponseDTO> store(@Valid @RequestBody PermisoRequestDTO request) {
        Permiso dominio = new Permiso();
        dominio.setNomPermiso(request.getNom_permiso());
        dominio.setDescripcion(request.getDescripcion());
        Permiso creado = managePermisoUseCase.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PermisoResponseDTO> update(@PathVariable Long id,
            @Valid @RequestBody PermisoRequestDTO request) {
        Permiso dominio = new Permiso();
        dominio.setNomPermiso(request.getNom_permiso());
        dominio.setDescripcion(request.getDescripcion());
        Permiso actualizado = managePermisoUseCase.actualizar(id, dominio);
        return ResponseEntity.ok(toResponseDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        managePermisoUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private PermisoResponseDTO toResponseDTO(Permiso permiso) {
        return new PermisoResponseDTO(permiso.getId(), permiso.getNomPermiso(), permiso.getDescripcion());
    }
}

