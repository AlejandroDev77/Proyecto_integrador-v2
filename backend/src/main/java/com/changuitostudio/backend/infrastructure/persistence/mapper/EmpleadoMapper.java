package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Empleado;
import com.changuitostudio.backend.infrastructure.persistence.entity.EmpleadoEntity;

public class EmpleadoMapper {

    public static Empleado toDomain(EmpleadoEntity entity) {
        if (entity == null) return null;
        Empleado domain = new Empleado();
        domain.setId(entity.getId());
        domain.setNomEmp(entity.getNomEmp());
        domain.setApPatEmp(entity.getApPatEmp());
        domain.setApMatEmp(entity.getApMatEmp());
        domain.setCelEmp(entity.getCelEmp());
        domain.setDirEmp(entity.getDirEmp());
        domain.setFecNacEmp(entity.getFecNacEmp());
        domain.setImgEmp(entity.getImgEmp());
        domain.setCarEmp(entity.getCarEmp());
        domain.setCiEmp(entity.getCiEmp());
        if (entity.getUsuario() != null) {
            domain.setUsuario(UsuarioMapper.toDomain(entity.getUsuario()));
            domain.setId_usu(entity.getUsuario().getIdUsu());
        }
        domain.setCodEmp(entity.getCodEmp());
        domain.setEstEmp(entity.getEstEmp());
        return domain;
    }

    public static EmpleadoEntity toEntity(Empleado domain) {
        if (domain == null) return null;
        EmpleadoEntity entity = new EmpleadoEntity();
        entity.setId(domain.getId());
        entity.setNomEmp(domain.getNomEmp());
        entity.setApPatEmp(domain.getApPatEmp());
        entity.setApMatEmp(domain.getApMatEmp());
        entity.setCelEmp(domain.getCelEmp());
        entity.setDirEmp(domain.getDirEmp());
        entity.setFecNacEmp(domain.getFecNacEmp());
        entity.setImgEmp(domain.getImgEmp());
        entity.setCarEmp(domain.getCarEmp());
        entity.setCiEmp(domain.getCiEmp());
        if (domain.getUsuario() != null) {
            entity.setUsuario(UsuarioMapper.toEntity(domain.getUsuario()));
        } else if (domain.getId_usu() != null) {
            com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity u = new com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity();
            u.setIdUsu(domain.getId_usu());
            entity.setUsuario(u);
        }
        entity.setCodEmp(domain.getCodEmp());
        entity.setEstEmp(domain.getEstEmp());
        return entity;
    }
}
