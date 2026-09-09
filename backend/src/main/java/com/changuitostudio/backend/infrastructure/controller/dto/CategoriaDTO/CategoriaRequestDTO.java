package com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO;

import jakarta.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CategoriaRequestDTO {

    @NotBlank(message = "El nombre de la categoría es requerido")
    @JsonProperty("nom_cat")
    private String nom_cat;
    
    @JsonProperty("desc_cat")
    private String desc_cat;
    
    @JsonProperty("cod_cat")
    private String cod_cat;

    @JsonProperty("est_cat")
    private Boolean est_cat = true;

    public CategoriaRequestDTO() {
    }

    public CategoriaRequestDTO(String nom_cat, String desc_cat, String cod_cat, Boolean est_cat) {
        this.nom_cat = nom_cat;
        this.desc_cat = desc_cat;
        this.cod_cat = cod_cat;
        this.est_cat = est_cat;
    }

    public String getNom_cat() {
        return nom_cat;
    }

    public void setNom_cat(String nom_cat) {
        this.nom_cat = nom_cat;
    }

    public Boolean getEst_cat() {
        return est_cat;
    }

    public void setEst_cat(Boolean est_cat) {
        this.est_cat = est_cat;
    }

    public String getDesc_cat() {
        return desc_cat;
    }

    public void setDesc_cat(String desc_cat) {
        this.desc_cat = desc_cat;
    }

    public String getCod_cat() {
        return cod_cat;
    }

    public void setCod_cat(String cod_cat) {
        this.cod_cat = cod_cat;
    }
}
