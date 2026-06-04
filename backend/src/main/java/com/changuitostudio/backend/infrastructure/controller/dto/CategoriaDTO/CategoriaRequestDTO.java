package com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO;

import jakarta.validation.constraints.NotBlank;

public class CategoriaRequestDTO {

    @NotBlank(message = "El nombre de la categoría es requerido")
    private String nom_cat;

    private Boolean est_cat = true;

    public CategoriaRequestDTO() {
    }

    public CategoriaRequestDTO(String nom_cat, Boolean est_cat) {
        this.nom_cat = nom_cat;
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
}
