package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "categorias_muebles")
public class CategoriaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cat")
    private Long idCat;

    @Column(name = "nom_cat", nullable = false)
    private String nomCat;

    @Column(name = "desc_cat")
    private String descCat;

    @Column(name = "est_cat")
    private Boolean estCat = true;

    @Column(name = "cod_cat")
    private String codCat;

    public CategoriaEntity() {
    }

    public Long getIdCat() {
        return idCat;
    }

    public void setIdCat(Long idCat) {
        this.idCat = idCat;
    }

    public String getNomCat() {
        return nomCat;
    }

    public void setNomCat(String nomCat) {
        this.nomCat = nomCat;
    }

    public String getDescCat() {
        return descCat;
    }

    public void setDescCat(String descCat) {
        this.descCat = descCat;
    }

    public Boolean getEstCat() {
        return estCat;
    }

    public void setEstCat(Boolean estCat) {
        this.estCat = estCat;
    }

    public String getCodCat() {
        return codCat;
    }

    public void setCodCat(String codCat) {
        this.codCat = codCat;
    }
}
