package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "muebles")
public class MuebleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mue")
    private Long idMue;

    @Column(name = "cod_mue", nullable = false)
    private String codMue;

    @Column(name = "nom_mue", nullable = false)
    private String nomMue;

    @Column(name = "img_mue")
    private String imgMue;

    @Column(name = "precio_venta", nullable = false)
    private Double precioVenta;

    @Column(name = "desc_mue", columnDefinition = "TEXT")
    private String descMue;

    @Column(name = "stock")
    private Integer stock = 0;

    @Column(name = "modelo_3d")
    private String modelo3d;

    @Column(name = "dimensiones")
    private String dimensiones;

    @Column(name = "est_mue")
    private Boolean estMue = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cat", nullable = false)
    private CategoriaEntity categoria;

    public MuebleEntity() {
    }

    public Long getIdMue() {
        return idMue;
    }

    public void setIdMue(Long idMue) {
        this.idMue = idMue;
    }

    public String getCodMue() {
        return codMue;
    }

    public void setCodMue(String codMue) {
        this.codMue = codMue;
    }

    public String getNomMue() {
        return nomMue;
    }

    public void setNomMue(String nomMue) {
        this.nomMue = nomMue;
    }

    public String getImgMue() {
        return imgMue;
    }

    public void setImgMue(String imgMue) {
        this.imgMue = imgMue;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }

    public String getDescMue() {
        return descMue;
    }

    public void setDescMue(String descMue) {
        this.descMue = descMue;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getModelo3d() {
        return modelo3d;
    }

    public void setModelo3d(String modelo3d) {
        this.modelo3d = modelo3d;
    }

    public String getDimensiones() {
        return dimensiones;
    }

    public void setDimensiones(String dimensiones) {
        this.dimensiones = dimensiones;
    }

    public Boolean getEstMue() {
        return estMue;
    }

    public void setEstMue(Boolean estMue) {
        this.estMue = estMue;
    }

    public CategoriaEntity getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaEntity categoria) {
        this.categoria = categoria;
    }
}
