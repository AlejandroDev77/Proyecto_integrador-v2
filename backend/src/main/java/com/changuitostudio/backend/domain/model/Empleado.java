package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class Empleado {
    private Long id;
    private String nomEmp;
    private String apPatEmp;
    private String apMatEmp;
    private String celEmp;
    private String dirEmp;
    private LocalDate fecNacEmp;
    private String imgEmp;
    private String carEmp;
    private String ciEmp;
    private Usuario usuario;
    private String codEmp;
    private Boolean estEmp;

    public Empleado() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_emp() {
        return id;
    }

    public void setId_emp(Long id_emp) {
        this.id = id_emp;
    }
    public String getNomEmp() {
        return nomEmp;
    }

    public void setNomEmp(String nomEmp) {
        this.nomEmp = nomEmp;
    }
    public String getApPatEmp() {
        return apPatEmp;
    }

    public void setApPatEmp(String apPatEmp) {
        this.apPatEmp = apPatEmp;
    }
    public String getApMatEmp() {
        return apMatEmp;
    }

    public void setApMatEmp(String apMatEmp) {
        this.apMatEmp = apMatEmp;
    }
    public String getCelEmp() {
        return celEmp;
    }

    public void setCelEmp(String celEmp) {
        this.celEmp = celEmp;
    }
    public String getDirEmp() {
        return dirEmp;
    }

    public void setDirEmp(String dirEmp) {
        this.dirEmp = dirEmp;
    }
    public LocalDate getFecNacEmp() {
        return fecNacEmp;
    }

    public void setFecNacEmp(LocalDate fecNacEmp) {
        this.fecNacEmp = fecNacEmp;
    }
    public String getImgEmp() {
        return imgEmp;
    }

    public void setImgEmp(String imgEmp) {
        this.imgEmp = imgEmp;
    }
    public String getCarEmp() {
        return carEmp;
    }

    public void setCarEmp(String carEmp) {
        this.carEmp = carEmp;
    }
    public String getCiEmp() {
        return ciEmp;
    }

    public void setCiEmp(String ciEmp) {
        this.ciEmp = ciEmp;
    }
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public String getCodEmp() {
        return codEmp;
    }

    public void setCodEmp(String codEmp) {
        this.codEmp = codEmp;
    }
    public Boolean getEstEmp() {
        return estEmp;
    }

    public void setEstEmp(Boolean estEmp) {
        this.estEmp = estEmp;
    }
}
