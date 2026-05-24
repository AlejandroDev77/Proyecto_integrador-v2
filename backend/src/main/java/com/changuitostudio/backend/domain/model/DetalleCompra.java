package com.changuitostudio.backend.domain.model;


public class DetalleCompra {
    private Long id;
    private CompraMaterial compra;
    private Material material;
    private Double cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private String codDetComp;
    private Boolean estDetComp;

    public DetalleCompra() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public CompraMaterial getCompra() {
        return compra;
    }

    public void setCompra(CompraMaterial compra) {
        this.compra = compra;
    }
    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }
    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
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
    public String getCodDetComp() {
        return codDetComp;
    }

    public void setCodDetComp(String codDetComp) {
        this.codDetComp = codDetComp;
    }
    public Boolean getEstDetComp() {
        return estDetComp;
    }

    public void setEstDetComp(Boolean estDetComp) {
        this.estDetComp = estDetComp;
    }
}
