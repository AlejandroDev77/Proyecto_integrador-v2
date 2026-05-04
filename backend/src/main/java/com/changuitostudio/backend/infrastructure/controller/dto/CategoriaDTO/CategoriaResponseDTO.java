package com.changuitostudio.backend.infrastructure.controller.dto.CategoriaDTO;

public class CategoriaResponseDTO {

    private Long id;
    private String nom_cat;
    private Boolean est_cat;

    public CategoriaResponseDTO() {
    }

    public CategoriaResponseDTO(Long id, String nom_cat) {
        this.id = id;
        this.nom_cat = nom_cat;
    }

    public CategoriaResponseDTO(Long id, String nom_cat, Boolean est_cat) {
        this.id = id;
        this.nom_cat = nom_cat;
        this.est_cat = est_cat;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
