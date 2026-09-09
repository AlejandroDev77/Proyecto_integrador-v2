package com.changuitostudio.backend.infrastructure.controller.dto.MuebleDTO;

import com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO.CategoriaResponseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

public class MuebleResponseDTO {

    private Long id;
    
    @JsonProperty("cod_mue")
    private String cod_mue;
    
    @JsonProperty("nom_mue")
    private String nom_mue;
    
    @JsonProperty("img_mue")
    private String img_mue;
    
    @JsonProperty("precio_venta")
    private Double precio_venta;
    
    @JsonProperty("precio_costo")
    private Double precio_costo;
    
    @JsonProperty("desc_mue")
    private String desc_mue;
    
    @JsonProperty("stock")
    private Integer stock;
    
    @JsonProperty("stock_min")
    private Integer stock_min;
    
    @JsonProperty("modelo_3d")
    private String modelo_3d;
    
    @JsonProperty("dimensiones")
    private String dimensiones;
    
    @JsonProperty("est_mue")
    private Boolean est_mue;
    private CategoriaResponseDTO categoria;

    public MuebleResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_mue() {
        return id;
    }

    public void setId_mue(Long id_mue) {
        this.id = id_mue;
    }

    public String getCod_mue() {
        return cod_mue;
    }

    public void setCod_mue(String cod_mue) {
        this.cod_mue = cod_mue;
    }

    public String getNom_mue() {
        return nom_mue;
    }

    public void setNom_mue(String nom_mue) {
        this.nom_mue = nom_mue;
    }

    public String getImg_mue() {
        return img_mue;
    }

    public void setImg_mue(String img_mue) {
        this.img_mue = img_mue;
    }

    public Double getPrecio_venta() {
        return precio_venta;
    }

    public void setPrecio_venta(Double precio_venta) {
        this.precio_venta = precio_venta;
    }

    public String getDesc_mue() {
        return desc_mue;
    }

    public void setDesc_mue(String desc_mue) {
        this.desc_mue = desc_mue;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getModelo_3d() {
        return modelo_3d;
    }

    public void setModelo_3d(String modelo_3d) {
        this.modelo_3d = modelo_3d;
    }

    public String getDimensiones() {
        return dimensiones;
    }

    public void setDimensiones(String dimensiones) {
        this.dimensiones = dimensiones;
    }

    public Boolean getEst_mue() {
        return est_mue;
    }

    public void setEst_mue(Boolean est_mue) {
        this.est_mue = est_mue;
    }

    public CategoriaResponseDTO getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaResponseDTO categoria) {
        this.categoria = categoria;
    }

    public Double getPrecio_costo() {
        return precio_costo;
    }

    public void setPrecio_costo(Double precio_costo) {
        this.precio_costo = precio_costo;
    }

    public Integer getStock_min() {
        return stock_min;
    }

    public void setStock_min(Integer stock_min) {
        this.stock_min = stock_min;
    }
}
