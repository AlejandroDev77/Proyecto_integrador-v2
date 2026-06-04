package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "materiales")
public class MaterialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mat")
    private Long id;

    @Column(name = "nom_mat")
    private String nomMat;

    @Column(name = "desc_mat")
    private String descMat;

    @Column(name = "stock_mat")
    private Double stockMat;

    @Column(name = "stock_min")
    private Double stockMin;

    @Column(name = "unidad_medida")
    private String unidadMedida;

    @Column(name = "costo_mat")
    private Double costoMat;

    @Column(name = "img_mat")
    private String imgMat;

    @Column(name = "est_mat")
    private Boolean estMat;

    @Column(name = "cod_mat")
    private String codMat;



    public MaterialEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomMat() { return nomMat; }
    public void setNomMat(String nomMat) { this.nomMat = nomMat; }
    public String getDescMat() { return descMat; }
    public void setDescMat(String descMat) { this.descMat = descMat; }
    public Double getStockMat() { return stockMat; }
    public void setStockMat(Double stockMat) { this.stockMat = stockMat; }
    public Double getStockMin() { return stockMin; }
    public void setStockMin(Double stockMin) { this.stockMin = stockMin; }
    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }
    public Double getCostoMat() { return costoMat; }
    public void setCostoMat(Double costoMat) { this.costoMat = costoMat; }
    public String getImgMat() { return imgMat; }
    public void setImgMat(String imgMat) { this.imgMat = imgMat; }
    public Boolean getEstMat() { return estMat; }
    public void setEstMat(Boolean estMat) { this.estMat = estMat; }
    public String getCodMat() { return codMat; }
    public void setCodMat(String codMat) { this.codMat = codMat; }

}
