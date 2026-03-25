package com.changuitostudio.backend.domain.model;

import java.util.HashSet;
import java.util.Set;

public class Rol {

    private Long id;
    private String nomRol;

    private Set<Permiso> permisos = new HashSet<>();

    public Rol() {
    }

    public Rol(Long id, String nomRol) {
        this.id = id;
        this.nomRol = nomRol;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Mantener compatibilidad con 'idRol' si existe código legacy
    public Long getIdRol() {
        return id;
    }

    public void setIdRol(Long idRol) {
        this.id = idRol;
    }

    // Getters y setters básicos
    public String getNomRol() {
        return nomRol;
    }

    public void setNomRol(String nomRol) {
        this.nomRol = nomRol;
    }

    public Set<Permiso> getPermisos() {
        return permisos;
    }

    public void setPermisos(Set<Permiso> permisos) {
        this.permisos = permisos;
    }

    public void agregarPermiso(Permiso permiso) {
        this.permisos.add(permiso);
    }

    public void removerPermiso(Permiso permiso) {
        this.permisos.remove(permiso);
    }
}
