package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class Venta {
    private Long id;
    private LocalDate fecVen;
    private String estVen;
    private Double totalVen;
    private Double descuento;
    private Cliente cliente;
    private Empleado empleado;
    private String notas;
    private String codVen;

    public Venta() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public LocalDate getFecVen() {
        return fecVen;
    }

    public void setFecVen(LocalDate fecVen) {
        this.fecVen = fecVen;
    }
    public String getEstVen() {
        return estVen;
    }

    public void setEstVen(String estVen) {
        this.estVen = estVen;
    }
    public Double getTotalVen() {
        return totalVen;
    }

    public void setTotalVen(Double totalVen) {
        this.totalVen = totalVen;
    }
    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }
    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
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
    public String getCodVen() {
        return codVen;
    }

    public void setCodVen(String codVen) {
        this.codVen = codVen;
    }
}
