package com.changuitostudio.backend.domain.model;


public class Diseno {
    private Long id;
    private String nomDis;
    private String descDis;
    private String archivo3d;
    private String imgDis;
    private Cotizacion cotizacion;
    private String codDis;

    public Diseno() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getNomDis() {
        return nomDis;
    }

    public void setNomDis(String nomDis) {
        this.nomDis = nomDis;
    }
    public String getDescDis() {
        return descDis;
    }

    public void setDescDis(String descDis) {
        this.descDis = descDis;
    }
    public String getArchivo3d() {
        return archivo3d;
    }

    public void setArchivo3d(String archivo3d) {
        this.archivo3d = archivo3d;
    }
    public String getImgDis() {
        return imgDis;
    }

    public void setImgDis(String imgDis) {
        this.imgDis = imgDis;
    }
    public Cotizacion getCotizacion() {
        return cotizacion;
    }

    public void setCotizacion(Cotizacion cotizacion) {
        this.cotizacion = cotizacion;
    }
    public String getCodDis() {
        return codDis;
    }

    public void setCodDis(String codDis) {
        this.codDis = codDis;
    }
}
