package com.changuitostudio.backend.domain.model;

public class Rol_Permiso {

    private Long id;
    private Rol rol;
    private Permiso permiso;

    public Rol_Permiso() {
    }

    public Rol_Permiso(Long id, Rol rol, Permiso permiso) {
        this.id = id;
        this.rol = rol;
        this.permiso = permiso;
    }

    // Captadores y Colocadores
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Permiso getPermiso() {
        return permiso;
    }

    public void setPermiso(Permiso permiso) {
        this.permiso = permiso;
    }


    
}
