package com.changuitostudio.backend.domain.model;

/**
 * Domain Model - Favorito
 */
public class Favorito {

    private Integer idFav;
    private Integer idCli;
    private Integer idMue;

    public Favorito() {
    }

    public Favorito(Integer idCli, Integer idMue) {
        this.idCli = idCli;
        this.idMue = idMue;
    }

    public Favorito(Integer idFav, Integer idCli, Integer idMue) {
        this.idFav = idFav;
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
