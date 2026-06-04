package com.changuitostudio.backend.domain.model;


public class DetalleVenta {
    private Long id;
    private Venta venta;
    private Mueble mueble;
    private Integer cantidad;
    private Double precioUnitario;
    private Double descuentoItem;
    private Double subtotal;
    private String codDetVen;

    public DetalleVenta() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
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
    public Double getDescuentoItem() {
        return descuentoItem;
    }

    public void setDescuentoItem(Double descuentoItem) {
        this.descuentoItem = descuentoItem;
    }
    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
    public String getCodDetVen() {
        return codDetVen;
    }

    public void setCodDetVen(String codDetVen) {
        this.codDetVen = codDetVen;
    }
}
