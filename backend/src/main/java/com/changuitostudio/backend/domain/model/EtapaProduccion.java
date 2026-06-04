package com.changuitostudio.backend.domain.model;


public class EtapaProduccion {
    private Long id;
    private String nomEta;
    private String descEta;
    private Integer duracionEstimada;
    private Integer ordenSecuencia;
    private String codEta;

    public EtapaProduccion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getNomEta() {
        return nomEta;
    }

    public void setNomEta(String nomEta) {
        this.nomEta = nomEta;
    }
    public String getDescEta() {
        return descEta;
    }

    public void setDescEta(String descEta) {
        this.descEta = descEta;
    }
    public Integer getDuracionEstimada() {
        return duracionEstimada;
    }

    public void setDuracionEstimada(Integer duracionEstimada) {
        this.duracionEstimada = duracionEstimada;
    }
    public Integer getOrdenSecuencia() {
        return ordenSecuencia;
    }

    public void setOrdenSecuencia(Integer ordenSecuencia) {
        this.ordenSecuencia = ordenSecuencia;
    }
    public String getCodEta() {
        return codEta;
    }

    public void setCodEta(String codEta) {
        this.codEta = codEta;
    }
}
