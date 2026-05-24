package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detalles_compra")
public class DetalleCompraEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_det_comp")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_comp")
    private CompraMaterialEntity compra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mat")
    private MaterialEntity material;

    @Column(name = "cantidad")
    private Double cantidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;

    @Column(name = "subtotal")
    private Double subtotal;

    @Column(name = "cod_det_comp")
    private String codDetComp;

    @Column(name = "est_det_comp")
    private Boolean estDetComp;



    public DetalleCompraEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CompraMaterialEntity getCompra() { return compra; }
    public void setCompra(CompraMaterialEntity compra) { this.compra = compra; }
    public MaterialEntity getMaterial() { return material; }
    public void setMaterial(MaterialEntity material) { this.material = material; }
    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public String getCodDetComp() { return codDetComp; }
    public void setCodDetComp(String codDetComp) { this.codDetComp = codDetComp; }
    public Boolean getEstDetComp() { return estDetComp; }
    public void setEstDetComp(Boolean estDetComp) { this.estDetComp = estDetComp; }

}
