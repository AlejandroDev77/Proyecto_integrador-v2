package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Categoria;
import com.changuitostudio.backend.infrastructure.persistence.entity.CategoriaEntity;
import org.springframework.stereotype.Component;


@Component
public class CategoriaMapper {

    public static Categoria toDomain(CategoriaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Categoria(
                entity.getIdCat(),
                entity.getNomCat(),
                entity.getDescCat(),
                entity.getCodCat(),
                entity.getEstCat()
        );
    }

   
    public static CategoriaEntity toEntity(Categoria domain) {
        if (domain == null) {
            return null;
        }
        CategoriaEntity entity = new CategoriaEntity();
        entity.setIdCat(domain.getId());
        entity.setNomCat(domain.getNombre());
        entity.setDescCat(domain.getDescripcion());
        entity.setCodCat(domain.getCodigo());
        entity.setEstCat(domain.getEstado());
        return entity;
    }
}
