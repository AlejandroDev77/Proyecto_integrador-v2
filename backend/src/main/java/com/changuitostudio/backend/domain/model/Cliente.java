package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class Cliente {
    private Long id;
    private String nomCli;
    private String apPatCli;
    private String apMatCli;
    private String celCli;
    private String dirCli;
    private LocalDate fecNacCli;
    private String imgCli;
    private String ciCli;
    private Usuario usuario;
    private String codCli;
    private Boolean estCli;
    private Long id_usu;

    public Cliente() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_cli() {
        return id;
    }

    public void setId_cli(Long id_cli) {
        this.id = id_cli;
    }
    public String getNomCli() {
        return nomCli;
    }

    public void setNomCli(String nomCli) {
        this.nomCli = nomCli;
    }
    public String getApPatCli() {
        return apPatCli;
    }

    public void setApPatCli(String apPatCli) {
        this.apPatCli = apPatCli;
    }
    public String getApMatCli() {
        return apMatCli;
    }

    public void setApMatCli(String apMatCli) {
        this.apMatCli = apMatCli;
    }
    public String getCelCli() {
        return celCli;
    }

    public void setCelCli(String celCli) {
        this.celCli = celCli;
    }
    public String getDirCli() {
        return dirCli;
    }

    public void setDirCli(String dirCli) {
        this.dirCli = dirCli;
    }
    public LocalDate getFecNacCli() {
        return fecNacCli;
    }

    public void setFecNacCli(LocalDate fecNacCli) {
        this.fecNacCli = fecNacCli;
    }
    public String getImgCli() {
        return imgCli;
    }

    public void setImgCli(String imgCli) {
        this.imgCli = imgCli;
    }
    public String getCiCli() {
        return ciCli;
    }

    public void setCiCli(String ciCli) {
        this.ciCli = ciCli;
    }
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public String getCodCli() {
        return codCli;
    }

    public void setCodCli(String codCli) {
        this.codCli = codCli;
    }
    public Boolean getEstCli() {
        return estCli;
    }

    public void setEstCli(Boolean estCli) {
        this.estCli = estCli;
    }
    public Long getId_usu() {
        return id_usu;
    }
    public void setId_usu(Long id_usu) {
        this.id_usu = id_usu;
    }
}
