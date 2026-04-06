package com.changuitostudio.backend.infrastructure.persistence.mapper;

import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.infrastructure.persistence.entity.RolEntity;
import com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity;

import org.springframework.stereotype.Component;

/**
 * Mapper â€” Convierte entre Domain Model (Usuario) y JPA Entity (UsuarioEntity).
 */
@Component
public class UsuarioMapper {

    /**
     * Domain Model â†’ JPA Entity
     */
    public UsuarioEntity toEntity(Usuario domain) {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setIdUsu(domain.getIdUsu());
        entity.setNomUsu(domain.getNomUsu());
        entity.setEmailUsu(domain.getEmailUsu());
        entity.setPasUsu(domain.getPasUsu());
        entity.setEstUsu(domain.getEstUsu());
        entity.setCodUsu(domain.getCodUsu());
        entity.setSecret2fa(domain.getSecret2fa());
        entity.setIs2faEnabled(domain.getIs2faEnabled());

        // Setear relaciÃ³n de rol
        if (domain.getIdRol() != null) {
            RolEntity rol = new RolEntity();
            rol.setIdRol(domain.getIdRol());
            entity.setRol(rol);
        }

        return entity;
    }

    /**
     * JPA Entity â†’ Domain Model
     */
    public Usuario toDomain(UsuarioEntity entity) {
        return new Usuario(
                entity.getIdUsu(),
                entity.getNomUsu(),
                entity.getEmailUsu(),
                entity.getPasUsu(),
                entity.getEstUsu(),
                entity.getCodUsu(),
                entity.getIdRol(),
                entity.getRol() != null ? entity.getRol().getNomRol() : null,
                entity.getSecret2fa(),
                entity.getIs2faEnabled());
    }
}

