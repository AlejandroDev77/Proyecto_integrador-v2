package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class Produccion {
    private Long id;
    private LocalDate fecIni;
    private LocalDate fecFinEstimada;
    private LocalDate fecFin;
    private String estPro;
    private String prioridad;
    private Venta venta;
    private Cotizacion cotizacion;
    private Empleado empleado;
    private String notas;
    private String codPro;

    public Produccion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public LocalDate getFecIni() {
        return fecIni;
    }

    public void setFecIni(LocalDate fecIni) {
        this.fecIni = fecIni;
    }
    public LocalDate getFecFinEstimada() {
        return fecFinEstimada;
    }

    public void setFecFinEstimada(LocalDate fecFinEstimada) {
        this.fecFinEstimada = fecFinEstimada;
    }
    public LocalDate getFecFin() {
        return fecFin;
    }

    public void setFecFin(LocalDate fecFin) {
        this.fecFin = fecFin;
    }
    public String getEstPro() {
        return estPro;
    }

    public void setEstPro(String estPro) {
        this.estPro = estPro;
    }
    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }
    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }
    public Cotizacion getCotizacion() {
        return cotizacion;
    }

    public void setCotizacion(Cotizacion cotizacion) {
        this.cotizacion = cotizacion;
    }
    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
    public String getCodPro() {
        return codPro;
    }

    public void setCodPro(String codPro) {
        this.codPro = codPro;
    }
}
