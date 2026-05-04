package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Mueble;
import com.changuitostudio.backend.domain.model.Categoria;
import com.changuitostudio.backend.infrastructure.persistence.entity.MuebleEntity;
import org.hibernate.ObjectNotFoundException;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class MuebleMapper {

    private final CategoriaMapper categoriaMapper;

    
    public MuebleMapper(CategoriaMapper categoriaMapper) {
        this.categoriaMapper = categoriaMapper;
    }

    
    public Mueble toDomain(MuebleEntity entity) {
        if (entity == null) {
            return null;
        }
        
        // Manejo seguro de categoría que podría no existir
        Categoria categoria = null;
        try {
            categoria = categoriaMapper.toDomain(entity.getCategoria());
        } catch (ObjectNotFoundException e) {
            // Si la categoría no existe, continuar sin ella (null)
            categoria = null;
        }
        
        return new Mueble(
                entity.getIdMue(),
                entity.getCodMue(),
                entity.getNomMue(),
                entity.getImgMue(),
                entity.getPrecioVenta(),
                entity.getDescMue(),
                entity.getStock(),
                entity.getModelo3d(),
                entity.getDimensiones(),
                categoria
        );
    }

    
    public MuebleEntity toEntity(Mueble domain) {
        if (domain == null) {
            return null;
        }
        MuebleEntity entity = new MuebleEntity();
        entity.setIdMue(domain.getId());
        entity.setCodMue(domain.getCodigo());
        entity.setNomMue(domain.getNombre());
        entity.setImgMue(domain.getImagen());
        entity.setPrecioVenta(domain.getPrecioVenta());
        entity.setDescMue(domain.getDescripcion());
        entity.setStock(domain.getStock());
        entity.setModelo3d(domain.getModelo3d());
        entity.setDimensiones(domain.getDimensiones());
        
        if (domain.getCategoria() != null) {
            entity.setCategoria(categoriaMapper.toEntity(domain.getCategoria()));
        }
        
        return entity;
    }
}
