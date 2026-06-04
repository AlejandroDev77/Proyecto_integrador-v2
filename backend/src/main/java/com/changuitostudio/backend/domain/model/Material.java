package com.changuitostudio.backend.domain.model;


public class Material {
    private Long id;
    private String nomMat;
    private String descMat;
    private Double stockMat;
    private Double stockMin;
    private String unidadMedida;
    private Double costoMat;
    private String imgMat;
    private Boolean estMat;
    private String codMat;

    public Material() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_mat() {
        return id;
    }

    public void setId_mat(Long id_mat) {
        this.id = id_mat;
    }
    public String getNomMat() {
        return nomMat;
    }

    public void setNomMat(String nomMat) {
        this.nomMat = nomMat;
    }
    public String getDescMat() {
        return descMat;
    }

    public void setDescMat(String descMat) {
        this.descMat = descMat;
    }
    public Double getStockMat() {
        return stockMat;
    }

    public void setStockMat(Double stockMat) {
        this.stockMat = stockMat;
    }
    public Double getStockMin() {
        return stockMin;
    }

    public void setStockMin(Double stockMin) {
        this.stockMin = stockMin;
    }
    public String getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }
    public Double getCostoMat() {
        return costoMat;
    }

    public void setCostoMat(Double costoMat) {
        this.costoMat = costoMat;
    }
    public String getImgMat() {
        return imgMat;
    }

    public void setImgMat(String imgMat) {
        this.imgMat = imgMat;
    }
    public Boolean getEstMat() {
        return estMat;
    }

    public void setEstMat(Boolean estMat) {
        this.estMat = estMat;
    }
    public String getCodMat() {
        return codMat;
    }

    public void setCodMat(String codMat) {
        this.codMat = codMat;
    }
}
