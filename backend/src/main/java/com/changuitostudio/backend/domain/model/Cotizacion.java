package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class Cotizacion {
    private Long id;
    private LocalDate fecCot;
    private String estCot;
    private Integer validezDias;
    private Double totalCot;
    private Double descuento;
    private Cliente cliente;
    private Empleado empleado;
    private String notas;
    private String codCot;
    private Double presupuestoCliente;
    private Integer plazoEsperado;
    private Integer tiempoEntrega;
    private String direccionInstalacion;
    private String tipoProyecto;

    public Cotizacion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public LocalDate getFecCot() {
        return fecCot;
    }

    public void setFecCot(LocalDate fecCot) {
        this.fecCot = fecCot;
    }
    public String getEstCot() {
        return estCot;
    }

    public void setEstCot(String estCot) {
        this.estCot = estCot;
    }
    public Integer getValidezDias() {
        return validezDias;
    }

    public void setValidezDias(Integer validezDias) {
        this.validezDias = validezDias;
    }
    public Double getTotalCot() {
        return totalCot;
    }

    public void setTotalCot(Double totalCot) {
        this.totalCot = totalCot;
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
    public String getCodCot() {
        return codCot;
    }

    public void setCodCot(String codCot) {
        this.codCot = codCot;
    }
    public Double getPresupuestoCliente() {
        return presupuestoCliente;
    }

    public void setPresupuestoCliente(Double presupuestoCliente) {
        this.presupuestoCliente = presupuestoCliente;
    }
    public Integer getPlazoEsperado() {
        return plazoEsperado;
    }

    public void setPlazoEsperado(Integer plazoEsperado) {
        this.plazoEsperado = plazoEsperado;
    }
    public Integer getTiempoEntrega() {
        return tiempoEntrega;
    }

    public void setTiempoEntrega(Integer tiempoEntrega) {
        this.tiempoEntrega = tiempoEntrega;
    }
    public String getDireccionInstalacion() {
        return direccionInstalacion;
    }

    public void setDireccionInstalacion(String direccionInstalacion) {
        this.direccionInstalacion = direccionInstalacion;
    }
    public String getTipoProyecto() {
        return tipoProyecto;
    }

    public void setTipoProyecto(String tipoProyecto) {
        this.tipoProyecto = tipoProyecto;
    }
}
