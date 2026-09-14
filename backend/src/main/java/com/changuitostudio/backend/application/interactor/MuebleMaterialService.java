package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MuebleMaterialRepository;
import com.changuitostudio.backend.application.usecase.ManageMaterialUseCase;
import com.changuitostudio.backend.application.usecase.ManageMuebleMaterialUseCase;
import com.changuitostudio.backend.domain.exception.MuebleMaterialNoEncontradoException;
import com.changuitostudio.backend.domain.model.Material;
import com.changuitostudio.backend.domain.model.MuebleMaterial;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class MuebleMaterialService implements ManageMuebleMaterialUseCase {

    private final MuebleMaterialRepository repository;
    private final ManageMaterialUseCase materialUseCase;

    public MuebleMaterialService(MuebleMaterialRepository repository, ManageMaterialUseCase materialUseCase) {
        this.repository = repository;
        this.materialUseCase = materialUseCase;
    }

    @Override
    public PageResult<MuebleMaterial> listar(int page, int perPage, Map<String, String> filters, String sort) {
        return repository.listar(page, perPage, filters, sort);
    }

    @Override
    public Optional<MuebleMaterial> obtenerPorId(Long id) {
        return repository.obtenerPorId(id);
    }

    @Override
    public MuebleMaterial crear(MuebleMaterial mueblematerial) {
        // Descontar stock del material
        Material material = materialUseCase.obtenerPorId(mueblematerial.getMaterial().getId())
            .orElseThrow(() -> new IllegalStateException("Material no encontrado"));
            
        if (material.getStockMat() < mueblematerial.getCantidad()) {
            throw new IllegalStateException("Stock insuficiente del material: " + material.getNomMat());
        }
        material.setStockMat(material.getStockMat() - mueblematerial.getCantidad());
        materialUseCase.actualizar(material.getId(), material);

        MuebleMaterial guardado = repository.guardar(mueblematerial);
        if (guardado.getCodMueMat() == null || guardado.getCodMueMat().trim().isEmpty()) {
            guardado.setCodMueMat("MMT-" + guardado.getId());
            return repository.guardar(guardado);
        }
        return guardado;
    }

    @Override
    public MuebleMaterial actualizar(Long id, MuebleMaterial mueblematerial) {
        return repository.obtenerPorId(id).map(existing -> {
            // Ajustar stock: restaurar lo viejo y descontar lo nuevo
            if (existing.getMaterial() != null && existing.getMaterial().getId().equals(mueblematerial.getMaterial().getId())) {
                Material material = materialUseCase.obtenerPorId(existing.getMaterial().getId())
                    .orElseThrow(() -> new IllegalStateException("Material no encontrado"));
                    
                Double diff = mueblematerial.getCantidad() - existing.getCantidad();
                if (diff > 0 && material.getStockMat() < diff) {
                    throw new IllegalStateException("Stock insuficiente del material: " + material.getNomMat());
                }
                material.setStockMat(material.getStockMat() - diff);
                materialUseCase.actualizar(material.getId(), material);
            }

            existing.setMueble(mueblematerial.getMueble());
            existing.setMaterial(mueblematerial.getMaterial());
            existing.setCantidad(mueblematerial.getCantidad());
            return repository.guardar(existing);
        }).orElseThrow(() -> new MuebleMaterialNoEncontradoException("MuebleMaterial no encontrado con ID: " + id));
    }

    @Override
    public void eliminar(Long id) {
        MuebleMaterial existing = repository.obtenerPorId(id)
            .orElseThrow(() -> new MuebleMaterialNoEncontradoException("MuebleMaterial no encontrado con ID: " + id));
            
        // Restaurar stock del material
        if (existing.getMaterial() != null) {
            Material material = materialUseCase.obtenerPorId(existing.getMaterial().getId()).orElse(null);
            if (material != null) {
                material.setStockMat(material.getStockMat() + existing.getCantidad());
                materialUseCase.actualizar(material.getId(), material);
            }
        }
        
        repository.eliminar(id);
    }
}
