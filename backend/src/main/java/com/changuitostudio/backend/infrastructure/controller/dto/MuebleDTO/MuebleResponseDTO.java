package com.changuitostudio.backend.infrastructure.controller.dto.MuebleDTO;

import com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO.CategoriaResponseDTO;

public class MuebleResponseDTO {

    private Long id_mue;
    private String cod_mue;
    private String nom_mue;
    private String img_mue;
    private Double precio_venta;
    private String desc_mue;
    private Integer stock;
    private String modelo_3d;
    private String dimensiones;
    private CategoriaResponseDTO categoria;

    public MuebleResponseDTO() {
    }

    public Long getId_mue() {
        return id_mue;
    }

    public void setId_mue(Long id_mue) {
        this.id_mue = id_mue;
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

    public CategoriaResponseDTO getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaResponseDTO categoria) {
        this.categoria = categoria;
    }
}
