package com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CategoriaResponseDTO {

    private Long id;
    
    @JsonProperty("nom_cat")
    private String nom_cat;
    
    @JsonProperty("desc_cat")
    private String desc_cat;
    
    @JsonProperty("cod_cat")
    private String cod_cat;
    
    @JsonProperty("est_cat")
    private Boolean est_cat;

    public CategoriaResponseDTO() {
    }

    public CategoriaResponseDTO(Long id, String nom_cat, String desc_cat, String cod_cat, Boolean est_cat) {
        this.id = id;
        this.nom_cat = nom_cat;
        this.desc_cat = desc_cat;
        this.cod_cat = cod_cat;
        this.est_cat = est_cat;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_cat() {
        return id;
    }

    public void setId_cat(Long id_cat) {
        this.id = id_cat;
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
