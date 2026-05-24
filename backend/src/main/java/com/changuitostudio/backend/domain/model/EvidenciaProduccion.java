package com.changuitostudio.backend.domain.model;

import java.time.LocalDateTime;

public class EvidenciaProduccion {
    private Long id;
    private ProduccionEtapa produccionEtapa;
    private String tipoEvi;
    private String archivoEvi;
    private String descripcion;
    private LocalDateTime fecEvi;
    private Empleado empleado;
    private String codEvi;

    public EvidenciaProduccion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public ProduccionEtapa getProduccionEtapa() {
        return produccionEtapa;
    }

    public void setProduccionEtapa(ProduccionEtapa produccionEtapa) {
        this.produccionEtapa = produccionEtapa;
    }
    public String getTipoEvi() {
        return tipoEvi;
    }

    public void setTipoEvi(String tipoEvi) {
        this.tipoEvi = tipoEvi;
    }
    public String getArchivoEvi() {
        return archivoEvi;
    }

    public void setArchivoEvi(String archivoEvi) {
        this.archivoEvi = archivoEvi;
    }
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public LocalDateTime getFecEvi() {
        return fecEvi;
    }

    public void setFecEvi(LocalDateTime fecEvi) {
        this.fecEvi = fecEvi;
    }
    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public String getCodEvi() {
        return codEvi;
    }

    public void setCodEvi(String codEvi) {
        this.codEvi = codEvi;
    }
}
