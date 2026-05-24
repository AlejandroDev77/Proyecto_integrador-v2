package com.changuitostudio.backend.domain.model;


public class Proveedor {
    private Long id;
    private String nomProv;
    private String contactoProv;
    private String telProv;
    private String emailProv;
    private String dirProv;
    private String nitProv;
    private Boolean estProv;
    private String codProv;

    public Proveedor() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getNomProv() {
        return nomProv;
    }

    public void setNomProv(String nomProv) {
        this.nomProv = nomProv;
    }
    public String getContactoProv() {
        return contactoProv;
    }

    public void setContactoProv(String contactoProv) {
        this.contactoProv = contactoProv;
    }
    public String getTelProv() {
        return telProv;
    }

    public void setTelProv(String telProv) {
        this.telProv = telProv;
    }
    public String getEmailProv() {
        return emailProv;
    }

    public void setEmailProv(String emailProv) {
        this.emailProv = emailProv;
    }
    public String getDirProv() {
        return dirProv;
    }

    public void setDirProv(String dirProv) {
        this.dirProv = dirProv;
    }
    public String getNitProv() {
        return nitProv;
    }

    public void setNitProv(String nitProv) {
        this.nitProv = nitProv;
    }
    public Boolean getEstProv() {
        return estProv;
    }

    public void setEstProv(Boolean estProv) {
        this.estProv = estProv;
    }
    public String getCodProv() {
        return codProv;
    }

    public void setCodProv(String codProv) {
        this.codProv = codProv;
    }
}
