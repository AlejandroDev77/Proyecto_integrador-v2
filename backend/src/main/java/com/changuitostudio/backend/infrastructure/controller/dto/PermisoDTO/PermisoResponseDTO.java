package com.changuitostudio.backend.infrastructure.controller.dto.PermisoDTO;

public class PermisoResponseDTO {
    
    private Long id;
    private String nom_permiso;
    private String descripcion;

    public PermisoResponseDTO() {
    }

    public PermisoResponseDTO(Long id, String nom_permiso) {
        this.id = id;
        this.nom_permiso = nom_permiso;
    }

    public PermisoResponseDTO(Long id, String nom_permiso, String descripcion) {
        this.id = id;
        this.nom_permiso = nom_permiso;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
