package com.changuitostudio.backend.domain.model;

import java.time.LocalDateTime;
import java.util.List;

public class GeneracionIA {
    private Long id;
    private String nombreMueble;
    private List<String> imagenesReferencia;
    private String modelo3dUrl;
    private String estado; // procesando, completado, error
    private LocalDateTime fechaCreacion;
    private Long idMueble; // Referencia opcional al mueble creado

    public GeneracionIA() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreMueble() {
        return nombreMueble;
    }

    public void setNombreMueble(String nombreMueble) {
        this.nombreMueble = nombreMueble;
    }

    public List<String> getImagenesReferencia() {
        return imagenesReferencia;
    }

    public void setImagenesReferencia(List<String> imagenesReferencia) {
        this.imagenesReferencia = imagenesReferencia;
    }

    public String getModelo3dUrl() {
        return modelo3dUrl;
    }

    public void setModelo3dUrl(String modelo3dUrl) {
        this.modelo3dUrl = modelo3dUrl;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Long getIdMueble() {
        return idMueble;
    }

    public void setIdMueble(Long idMueble) {
        this.idMueble = idMueble;
    }
}
