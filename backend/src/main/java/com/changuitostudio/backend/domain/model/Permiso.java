package com.changuitostudio.backend.domain.model;

public class Permiso {

    private Long id;
    private String nombre;
    private String descripcion;

    public Permiso() {
    }

    public Permiso(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Permiso(Long id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // Captadores y Colocadores
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomPermiso() {
        return nombre;
    }

    public void setNomPermiso(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Permiso permiso = (Permiso) o;
        return id != null && id.equals(permiso.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
