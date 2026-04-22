package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CategoriaRepository;
import com.changuitostudio.backend.application.usecase.ManageMuebleUseCase;
import com.changuitostudio.backend.domain.model.Categoria;
import com.changuitostudio.backend.domain.model.Mueble;
import com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO.CategoriaResponseDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.MuebleDTO.MuebleRequestDTO;
import com.changuitostudio.backend.infrastructure.controller.dto.MuebleDTO.MuebleResponseDTO;
import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/mueble")
public class MuebleController {

    private final ManageMuebleUseCase manageMuebleUseCase;
    private final CategoriaRepository categoriaRepository;

   
    public MuebleController(ManageMuebleUseCase manageMuebleUseCase, CategoriaRepository categoriaRepository) {
        this.manageMuebleUseCase = manageMuebleUseCase;
        this.categoriaRepository = categoriaRepository;
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
            PageResult<Mueble> allData = manageMuebleUseCase.listarMuebles(1, Integer.MAX_VALUE, filters, sort);
            return ResponseEntity.ok(allData.getContent().stream().map(this::toResponseDTO).toList());
        }

        int currentPage = (page != null) ? page : 1;
        int size = (per_page != null) ? per_page : 20;

        PageResult<Mueble> resultado = manageMuebleUseCase.listarMuebles(currentPage, size, filters, sort);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("data", resultado.getContent().stream().map(this::toResponseDTO).toList());
        response.put("current_page", resultado.getPage());
        response.put("per_page", resultado.getSize());
        response.put("total", resultado.getTotalElements());
        response.put("last_page", resultado.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MuebleResponseDTO> show(@PathVariable Long id) {
        return manageMuebleUseCase.obtenerPorId(id)
                .map(mueble -> ResponseEntity.ok(toResponseDTO(mueble)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MuebleResponseDTO> store(@Valid @RequestBody MuebleRequestDTO request) {
        Categoria categoria = categoriaRepository.buscarPorId(request.getId_cat())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Mueble dominio = new Mueble();
        dominio.setCodigo(request.getCod_mue());
        dominio.setNombre(request.getNom_mue());
        dominio.setImagen(request.getImg_mue());
        dominio.setPrecioVenta(request.getPrecio_venta());
        dominio.setDescripcion(request.getDesc_mue());
        dominio.setStock(request.getStock() != null ? request.getStock() : 0);
        dominio.setModelo3d(request.getModelo_3d());
        dominio.setDimensiones(request.getDimensiones());
        dominio.setCategoria(categoria);

        Mueble creado = manageMuebleUseCase.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MuebleResponseDTO> update(@PathVariable Long id,
            @Valid @RequestBody MuebleRequestDTO request) {
        Categoria categoria = categoriaRepository.buscarPorId(request.getId_cat())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Mueble dominio = new Mueble();
        dominio.setCodigo(request.getCod_mue());
        dominio.setNombre(request.getNom_mue());
        dominio.setImagen(request.getImg_mue());
        dominio.setPrecioVenta(request.getPrecio_venta());
        dominio.setDescripcion(request.getDesc_mue());
        dominio.setStock(request.getStock());
        dominio.setModelo3d(request.getModelo_3d());
        dominio.setDimensiones(request.getDimensiones());
        dominio.setCategoria(categoria);

        Mueble actualizado = manageMuebleUseCase.actualizar(id, dominio);
        return ResponseEntity.ok(toResponseDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        manageMuebleUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private MuebleResponseDTO toResponseDTO(Mueble mueble) {
        MuebleResponseDTO dto = new MuebleResponseDTO();
        dto.setId_mue(mueble.getId());
        dto.setCod_mue(mueble.getCodigo());
        dto.setNom_mue(mueble.getNombre());
        dto.setImg_mue(mueble.getImagen());
        dto.setPrecio_venta(mueble.getPrecioVenta());
        dto.setDesc_mue(mueble.getDescripcion());
        dto.setStock(mueble.getStock());
        dto.setModelo_3d(mueble.getModelo3d());
        dto.setDimensiones(mueble.getDimensiones());

        if (mueble.getCategoria() != null) {
            CategoriaResponseDTO catDto = new CategoriaResponseDTO(
                    mueble.getCategoria().getId(),
                    mueble.getCategoria().getNombre(),
                    mueble.getCategoria().getEstado()
            );
            dto.setCategoria(catDto);
        }

        return dto;
    }
}
