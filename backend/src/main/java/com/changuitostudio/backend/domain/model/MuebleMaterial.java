package com.changuitostudio.backend.domain.model;


public class MuebleMaterial {
    private Long id;
    private Mueble mueble;
    private Material material;
    private Double cantidad;
    private String codMueMat;
    private Boolean estMueMat;

    public MuebleMaterial() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_mue_mat() {
        return id;
    }

    public void setId_mue_mat(Long id_mue_mat) {
        this.id = id_mue_mat;
    }
    public Mueble getMueble() {
        return mueble;
    }

    public void setMueble(Mueble mueble) {
        this.mueble = mueble;
    }
    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }
    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }
    public String getCodMueMat() {
        return codMueMat;
    }

    public void setCodMueMat(String codMueMat) {
        this.codMueMat = codMueMat;
    }
    public Boolean getEstMueMat() {
        return estMueMat;
    }

    public void setEstMueMat(Boolean estMueMat) {
        this.estMueMat = estMueMat;
    }
}
