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
import org.springframework.web.multipart.MultipartFile;
import com.changuitostudio.backend.application.gateway.StorageGateway;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;


@RestController
@RequestMapping({"/api/muebles", "/api/mueble"})
public class MuebleController {

    private final ManageMuebleUseCase manageMuebleUseCase;
    private final CategoriaRepository categoriaRepository;
    private final StorageGateway storageGateway;

    public MuebleController(ManageMuebleUseCase manageMuebleUseCase, CategoriaRepository categoriaRepository, StorageGateway storageGateway) {
        this.manageMuebleUseCase = manageMuebleUseCase;
        this.categoriaRepository = categoriaRepository;
        this.storageGateway = storageGateway;
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

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<MuebleResponseDTO> store(
            @RequestParam(value = "cod_mue", required = false) String codMue,
            @RequestParam("nom_mue") String nomMue,
            @RequestParam(value = "desc_mue", required = false) String descMue,
            @RequestParam("precio_venta") Double precioVenta,
            @RequestParam(value = "precio_costo", required = false) Double precioCosto,
            @RequestParam(value = "stock", required = false, defaultValue = "0") Integer stock,
            @RequestParam(value = "stock_min", required = false, defaultValue = "0") Integer stockMin,
            @RequestParam(value = "dimensiones", required = false) String dimensiones,
            @RequestParam(value = "est_mue", required = false, defaultValue = "1") String estMue,
            @RequestParam("id_cat") Long idCat,
            @RequestParam(value = "img_mue", required = false) MultipartFile imgMue,
            @RequestParam(value = "modelo_3d", required = false) MultipartFile modelo3d
    ) {
        Categoria categoria = categoriaRepository.buscarPorId(idCat)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Mueble dominio = new Mueble();
        dominio.setCodigo(codMue);
        dominio.setNombre(nomMue);
        dominio.setPrecioVenta(precioVenta != null ? precioVenta : 0.0);
        dominio.setPrecioCosto(precioCosto != null ? precioCosto : 0.0);
        dominio.setDescripcion(descMue);
        dominio.setStock(stock != null ? stock : 0);
        dominio.setStockMinimo(stockMin != null ? stockMin : 0);
        dominio.setDimensiones(dimensiones);
        dominio.setEstado("1".equals(estMue) || "true".equalsIgnoreCase(estMue));
        dominio.setCategoria(categoria);

        if (imgMue != null && !imgMue.isEmpty()) {
            dominio.setImagen(storageGateway.save(imgMue, "images"));
        }
        if (modelo3d != null && !modelo3d.isEmpty()) {
            dominio.setModelo3d(storageGateway.save(modelo3d, "models"));
        }

        Mueble creado = manageMuebleUseCase.crear(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(creado));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<MuebleResponseDTO> update(
            @PathVariable Long id,
            @RequestParam(value = "cod_mue", required = false) String codMue,
            @RequestParam("nom_mue") String nomMue,
            @RequestParam(value = "desc_mue", required = false) String descMue,
            @RequestParam("precio_venta") Double precioVenta,
            @RequestParam(value = "precio_costo", required = false) Double precioCosto,
            @RequestParam(value = "stock", required = false, defaultValue = "0") Integer stock,
            @RequestParam(value = "stock_min", required = false, defaultValue = "0") Integer stockMin,
            @RequestParam(value = "dimensiones", required = false) String dimensiones,
            @RequestParam(value = "est_mue", required = false, defaultValue = "1") String estMue,
            @RequestParam("id_cat") Long idCat,
            @RequestParam(value = "img_mue", required = false) MultipartFile imgMue,
            @RequestParam(value = "modelo_3d", required = false) MultipartFile modelo3d
    ) {
        Categoria categoria = categoriaRepository.buscarPorId(idCat)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Mueble dominio = new Mueble();
        dominio.setCodigo(codMue);
        dominio.setNombre(nomMue);
        dominio.setPrecioVenta(precioVenta != null ? precioVenta : 0.0);
        dominio.setPrecioCosto(precioCosto != null ? precioCosto : 0.0);
        dominio.setDescripcion(descMue);
        dominio.setStock(stock != null ? stock : 0);
        dominio.setStockMinimo(stockMin != null ? stockMin : 0);
        dominio.setDimensiones(dimensiones);
        dominio.setEstado("1".equals(estMue) || "true".equalsIgnoreCase(estMue));
        dominio.setCategoria(categoria);

        if (imgMue != null && !imgMue.isEmpty()) {
            dominio.setImagen(storageGateway.save(imgMue, "images"));
        }
        if (modelo3d != null && !modelo3d.isEmpty()) {
            dominio.setModelo3d(storageGateway.save(modelo3d, "models"));
        }

        Mueble actualizado = manageMuebleUseCase.actualizar(id, dominio);
        return ResponseEntity.ok(toResponseDTO(actualizado));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Boolean estado = body.get("est_mue");
        if (estado == null) {
            return ResponseEntity.badRequest().build();
        }
        manageMuebleUseCase.cambiarEstado(id, estado);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        manageMuebleUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private MuebleResponseDTO toResponseDTO(Mueble mueble) {
        MuebleResponseDTO dto = new MuebleResponseDTO();
        dto.setId(mueble.getId());
        dto.setCod_mue(mueble.getCodigo());
        dto.setNom_mue(mueble.getNombre());
        dto.setImg_mue(mueble.getImagen());
        dto.setPrecio_venta(mueble.getPrecioVenta());
        dto.setPrecio_costo(mueble.getPrecioCosto());
        dto.setDesc_mue(mueble.getDescripcion());
        dto.setStock(mueble.getStock());
        dto.setStock_min(mueble.getStockMinimo());
        dto.setModelo_3d(mueble.getModelo3d());
        dto.setDimensiones(mueble.getDimensiones());
        dto.setEst_mue(mueble.getEstado());

        if (mueble.getCategoria() != null) {
            CategoriaResponseDTO catDto = new CategoriaResponseDTO(
                    mueble.getCategoria().getId(),
                    mueble.getCategoria().getNombre(),
                    mueble.getCategoria().getDescripcion(),
                    mueble.getCategoria().getCodigo(),
                    mueble.getCategoria().getEstado()
            );
            dto.setCategoria(catDto);
        }

        return dto;
    }
}
