package com.changuitostudio.backend.infrastructure.controller.dto.PermisoDTO;

import jakarta.validation.constraints.NotBlank;

public class PermisoRequestDTO {
    
    @NotBlank(message = "El nombre del permiso es requerido")
    private String nom_permiso;
    
    private String descripcion;

    public PermisoRequestDTO() {
    }

    public PermisoRequestDTO(String nom_permiso, String descripcion) {
        this.nom_permiso = nom_permiso;
        this.descripcion = descripcion;
    }

    public String getNom_permiso() {
        return nom_permiso;
    }

    public void setNom_permiso(String nom_permiso) {
        this.nom_permiso = nom_permiso;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
