package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Cliente;
import com.changuitostudio.backend.infrastructure.persistence.entity.ClienteEntity;

public class ClienteMapper {

    public static Cliente toDomain(ClienteEntity entity) {
        if (entity == null) return null;
        Cliente domain = new Cliente();
        domain.setId(entity.getId());
        domain.setNomCli(entity.getNomCli());
        domain.setApPatCli(entity.getApPatCli());
        domain.setApMatCli(entity.getApMatCli());
        domain.setCelCli(entity.getCelCli());
        domain.setDirCli(entity.getDirCli());
        domain.setFecNacCli(entity.getFecNacCli());
        domain.setImgCli(entity.getImgCli());
        domain.setCiCli(entity.getCiCli());
        if (entity.getUsuario() != null) {
            domain.setUsuario(UsuarioMapper.toDomain(entity.getUsuario()));
            domain.setId_usu(entity.getUsuario().getIdUsu());
        }
        domain.setCodCli(entity.getCodCli());
        domain.setEstCli(entity.getEstCli());
        return domain;
    }

    public static ClienteEntity toEntity(Cliente domain) {
        if (domain == null) return null;
        ClienteEntity entity = new ClienteEntity();
        entity.setId(domain.getId());
        entity.setNomCli(domain.getNomCli());
        entity.setApPatCli(domain.getApPatCli());
        entity.setApMatCli(domain.getApMatCli());
        entity.setCelCli(domain.getCelCli());
        entity.setDirCli(domain.getDirCli());
        entity.setFecNacCli(domain.getFecNacCli());
        entity.setImgCli(domain.getImgCli());
        entity.setCiCli(domain.getCiCli());
        if (domain.getUsuario() != null) {
            entity.setUsuario(UsuarioMapper.toEntity(domain.getUsuario()));
        } else if (domain.getId_usu() != null) {
            com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity u = new com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity();
            u.setIdUsu(domain.getId_usu());
            entity.setUsuario(u);
        }
        entity.setCodCli(domain.getCodCli());
        entity.setEstCli(domain.getEstCli());
        return entity;
    }
}
