package com.changuitostudio.backend.infrastructure.controller.dto.MuebleDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MuebleRequestDTO {

    @NotBlank(message = "El código del mueble es requerido")
    private String cod_mue;

    @NotBlank(message = "El nombre del mueble es requerido")
    private String nom_mue;

    private String img_mue;

    @NotNull(message = "El precio de venta es requerido")
    private Double precio_venta;

    private String desc_mue;

    private Integer stock = 0;

    private String modelo_3d;

    private String dimensiones;

    @NotNull(message = "La categoría es requerida")
    private Long id_cat;

    public MuebleRequestDTO() {
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

    public Long getId_cat() {
        return id_cat;
    }

    public void setId_cat(Long id_cat) {
        this.id_cat = id_cat;
    }
}
