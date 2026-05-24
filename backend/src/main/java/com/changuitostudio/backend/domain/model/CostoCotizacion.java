package com.changuitostudio.backend.domain.model;


public class CostoCotizacion {
    private Long id;
    private Cotizacion cotizacion;
    private Double costoMateriales;
    private Double costoManoObra;
    private Double costosIndirectos;
    private Double margenGanancia;
    private Double costoTotal;
    private Double precioSugerido;

    public CostoCotizacion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Cotizacion getCotizacion() {
        return cotizacion;
    }

    public void setCotizacion(Cotizacion cotizacion) {
        this.cotizacion = cotizacion;
    }
    public Double getCostoMateriales() {
        return costoMateriales;
    }

    public void setCostoMateriales(Double costoMateriales) {
        this.costoMateriales = costoMateriales;
    }
    public Double getCostoManoObra() {
        return costoManoObra;
    }

    public void setCostoManoObra(Double costoManoObra) {
        this.costoManoObra = costoManoObra;
    }
    public Double getCostosIndirectos() {
        return costosIndirectos;
    }

    public void setCostosIndirectos(Double costosIndirectos) {
        this.costosIndirectos = costosIndirectos;
    }
    public Double getMargenGanancia() {
        return margenGanancia;
    }

    public void setMargenGanancia(Double margenGanancia) {
        this.margenGanancia = margenGanancia;
    }
    public Double getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(Double costoTotal) {
        this.costoTotal = costoTotal;
    }
    public Double getPrecioSugerido() {
        return precioSugerido;
    }

    public void setPrecioSugerido(Double precioSugerido) {
        this.precioSugerido = precioSugerido;
    }
}
