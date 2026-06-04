package com.changuitostudio.backend.domain.model;

import java.time.LocalDateTime;

public class MovimientoInventario {
    private Long id;
    private String tipoMov;
    private LocalDateTime fechaMov;
    private Material material;
    private Mueble mueble;
    private Double cantidad;
    private Double stockAnterior;
    private Double stockPosterior;
    private Venta venta;
    private Produccion produccion;
    private CompraMaterial compra;
    private Devolucion devolucion;
    private String motivo;
    private Empleado empleado;
    private String codMov;

    public MovimientoInventario() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getTipoMov() {
        return tipoMov;
    }

    public void setTipoMov(String tipoMov) {
        this.tipoMov = tipoMov;
    }
    public LocalDateTime getFechaMov() {
        return fechaMov;
    }

    public void setFechaMov(LocalDateTime fechaMov) {
        this.fechaMov = fechaMov;
    }
    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }
    public Mueble getMueble() {
        return mueble;
    }

    public void setMueble(Mueble mueble) {
        this.mueble = mueble;
    }
    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }
    public Double getStockAnterior() {
        return stockAnterior;
    }

    public void setStockAnterior(Double stockAnterior) {
        this.stockAnterior = stockAnterior;
    }
    public Double getStockPosterior() {
        return stockPosterior;
    }

    public void setStockPosterior(Double stockPosterior) {
        this.stockPosterior = stockPosterior;
    }
    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }
    public Produccion getProduccion() {
        return produccion;
    }

    public void setProduccion(Produccion produccion) {
        this.produccion = produccion;
    }
    public CompraMaterial getCompra() {
        return compra;
    }

    public void setCompra(CompraMaterial compra) {
        this.compra = compra;
    }
    public Devolucion getDevolucion() {
        return devolucion;
    }

    public void setDevolucion(Devolucion devolucion) {
        this.devolucion = devolucion;
    }
    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public String getCodMov() {
        return codMov;
    }

    public void setCodMov(String codMov) {
        this.codMov = codMov;
    }
}
