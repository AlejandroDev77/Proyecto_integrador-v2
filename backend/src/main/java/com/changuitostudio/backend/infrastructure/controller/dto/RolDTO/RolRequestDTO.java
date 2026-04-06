package com.changuitostudio.backend.infrastructure.controller.dto.RolDTO;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO de entrada para crear/actualizar un rol.
 * Campos iguales a los que envÃ­a el frontend.
 */
public class RolRequestDTO {
    
    @NotBlank(message = "El nombre del rol es obligatorio.")
    private String nom_rol;

    public RolRequestDTO() {
    }

    public String getNom_rol() {
        return nom_rol;
    }

    public void setNom_rol(String nom_rol) {
        this.nom_rol = nom_rol;
    }
}

