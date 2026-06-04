package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "favoritos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id_cli", "id_mue"})
})
public class FavoritoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_fav")
    private Integer idFav;

    @Column(name = "id_cli", nullable = false)
    private Integer idCli;

    @Column(name = "id_mue", nullable = false)
    private Integer idMue;

    public FavoritoEntity() {
    }

    public FavoritoEntity(Integer idCli, Integer idMue) {
        this.idCli = idCli;
        this.idMue = idMue;
    }

    public Integer getIdFav() {
        return idFav;
    }

    public void setIdFav(Integer idFav) {
        this.idFav = idFav;
    }

    public Integer getIdCli() {
        return idCli;
    }

    public void setIdCli(Integer idCli) {
        this.idCli = idCli;
    }

    public Integer getIdMue() {
        return idMue;
    }

    public void setIdMue(Integer idMue) {
        this.idMue = idMue;
    }
}
