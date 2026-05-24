package com.changuitostudio.backend.domain.model;


public class DetalleDevolucion {
    private Long id;
    private Devolucion devolucion;
    private Mueble mueble;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private String codDetDev;

    public DetalleDevolucion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Devolucion getDevolucion() {
        return devolucion;
    }

    public void setDevolucion(Devolucion devolucion) {
        this.devolucion = devolucion;
    }
    public Mueble getMueble() {
        return mueble;
    }

    public void setMueble(Mueble mueble) {
        this.mueble = mueble;
    }
    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
    public String getCodDetDev() {
        return codDetDev;
    }

    public void setCodDetDev(String codDetDev) {
        this.codDetDev = codDetDev;
    }
}
