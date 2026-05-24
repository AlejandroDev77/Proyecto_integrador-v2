package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detalles_venta")
public class DetalleVentaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_det_ven")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ven")
    private VentaEntity venta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mue")
    private MuebleEntity mueble;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;

    @Column(name = "descuento_item")
    private Double descuentoItem;

    @Column(name = "subtotal")
    private Double subtotal;

    @Column(name = "cod_det_ven")
    private String codDetVen;



    public DetalleVentaEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public VentaEntity getVenta() { return venta; }
    public void setVenta(VentaEntity venta) { this.venta = venta; }
    public MuebleEntity getMueble() { return mueble; }
    public void setMueble(MuebleEntity mueble) { this.mueble = mueble; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    public Double getDescuentoItem() { return descuentoItem; }
    public void setDescuentoItem(Double descuentoItem) { this.descuentoItem = descuentoItem; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public String getCodDetVen() { return codDetVen; }
    public void setCodDetVen(String codDetVen) { this.codDetVen = codDetVen; }

}
