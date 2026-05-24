package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.MovimientoInventario;
import com.changuitostudio.backend.infrastructure.persistence.entity.MovimientoInventarioEntity;

public class MovimientoInventarioMapper {

    public static MovimientoInventario toDomain(MovimientoInventarioEntity entity) {
        if (entity == null) return null;
        MovimientoInventario domain = new MovimientoInventario();
        domain.setId(entity.getId());
        domain.setTipoMov(entity.getTipoMov());
        domain.setFechaMov(entity.getFechaMov());
        if (entity.getMaterial() != null) {
            domain.setMaterial(MaterialMapper.toDomain(entity.getMaterial()));
        }
        if (entity.getMueble() != null) {
            domain.setMueble(MuebleMapper.toDomain(entity.getMueble()));
        }
        domain.setCantidad(entity.getCantidad());
        domain.setStockAnterior(entity.getStockAnterior());
        domain.setStockPosterior(entity.getStockPosterior());
        if (entity.getVenta() != null) {
            domain.setVenta(VentaMapper.toDomain(entity.getVenta()));
        }
        if (entity.getProduccion() != null) {
            domain.setProduccion(ProduccionMapper.toDomain(entity.getProduccion()));
        }
        if (entity.getCompra() != null) {
            domain.setCompra(CompraMaterialMapper.toDomain(entity.getCompra()));
        }
        if (entity.getDevolucion() != null) {
            domain.setDevolucion(DevolucionMapper.toDomain(entity.getDevolucion()));
        }
        domain.setMotivo(entity.getMotivo());
        if (entity.getEmpleado() != null) {
            domain.setEmpleado(EmpleadoMapper.toDomain(entity.getEmpleado()));
        }
        domain.setCodMov(entity.getCodMov());
        return domain;
    }

    public static MovimientoInventarioEntity toEntity(MovimientoInventario domain) {
        if (domain == null) return null;
        MovimientoInventarioEntity entity = new MovimientoInventarioEntity();
        entity.setId(domain.getId());
        entity.setTipoMov(domain.getTipoMov());
        entity.setFechaMov(domain.getFechaMov());
        if (domain.getMaterial() != null) {
            entity.setMaterial(MaterialMapper.toEntity(domain.getMaterial()));
        }
        if (domain.getMueble() != null) {
            entity.setMueble(MuebleMapper.toEntity(domain.getMueble()));
        }
        entity.setCantidad(domain.getCantidad());
        entity.setStockAnterior(domain.getStockAnterior());
        entity.setStockPosterior(domain.getStockPosterior());
        if (domain.getVenta() != null) {
            entity.setVenta(VentaMapper.toEntity(domain.getVenta()));
        }
        if (domain.getProduccion() != null) {
            entity.setProduccion(ProduccionMapper.toEntity(domain.getProduccion()));
        }
        if (domain.getCompra() != null) {
            entity.setCompra(CompraMaterialMapper.toEntity(domain.getCompra()));
        }
        if (domain.getDevolucion() != null) {
            entity.setDevolucion(DevolucionMapper.toEntity(domain.getDevolucion()));
        }
        entity.setMotivo(domain.getMotivo());
        if (domain.getEmpleado() != null) {
            entity.setEmpleado(EmpleadoMapper.toEntity(domain.getEmpleado()));
        }
        entity.setCodMov(domain.getCodMov());
        return entity;
    }
}
