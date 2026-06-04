package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class Devolucion {
    private Long id;
    private LocalDate fecDev;
    private String motivoDev;
    private Venta venta;
    private Double totalDev;
    private String estDev;
    private Empleado empleado;
    private String codDev;

    public Devolucion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public LocalDate getFecDev() {
        return fecDev;
    }

    public void setFecDev(LocalDate fecDev) {
        this.fecDev = fecDev;
    }
    public String getMotivoDev() {
        return motivoDev;
    }

    public void setMotivoDev(String motivoDev) {
        this.motivoDev = motivoDev;
    }
    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }
    public Double getTotalDev() {
        return totalDev;
    }

    public void setTotalDev(Double totalDev) {
        this.totalDev = totalDev;
    }
    public String getEstDev() {
        return estDev;
    }

    public void setEstDev(String estDev) {
        this.estDev = estDev;
    }
    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public String getCodDev() {
        return codDev;
    }

    public void setCodDev(String codDev) {
        this.codDev = codDev;
    }
}
