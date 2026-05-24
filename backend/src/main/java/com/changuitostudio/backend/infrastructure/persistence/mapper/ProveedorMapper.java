package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Proveedor;
import com.changuitostudio.backend.infrastructure.persistence.entity.ProveedorEntity;

public class ProveedorMapper {

    public static Proveedor toDomain(ProveedorEntity entity) {
        if (entity == null) return null;
        Proveedor domain = new Proveedor();
        domain.setId(entity.getId());
        domain.setNomProv(entity.getNomProv());
        domain.setContactoProv(entity.getContactoProv());
        domain.setTelProv(entity.getTelProv());
        domain.setEmailProv(entity.getEmailProv());
        domain.setDirProv(entity.getDirProv());
        domain.setNitProv(entity.getNitProv());
        domain.setEstProv(entity.getEstProv());
        domain.setCodProv(entity.getCodProv());
        return domain;
    }

    public static ProveedorEntity toEntity(Proveedor domain) {
        if (domain == null) return null;
        ProveedorEntity entity = new ProveedorEntity();
        entity.setId(domain.getId());
        entity.setNomProv(domain.getNomProv());
        entity.setContactoProv(domain.getContactoProv());
        entity.setTelProv(domain.getTelProv());
        entity.setEmailProv(domain.getEmailProv());
        entity.setDirProv(domain.getDirProv());
        entity.setNitProv(domain.getNitProv());
        entity.setEstProv(domain.getEstProv());
        entity.setCodProv(domain.getCodProv());
        return entity;
    }
}
