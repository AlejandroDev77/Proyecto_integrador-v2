package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "etapas_produccion")
public class EtapaProduccionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_eta")
    private Long id;

    @Column(name = "nom_eta")
    private String nomEta;

    @Column(name = "desc_eta")
    private String descEta;

    @Column(name = "duracion_estimada")
    private Integer duracionEstimada;

    @Column(name = "orden_secuencia")
    private Integer ordenSecuencia;

    @Column(name = "cod_eta")
    private String codEta;



    public EtapaProduccionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomEta() { return nomEta; }
    public void setNomEta(String nomEta) { this.nomEta = nomEta; }
    public String getDescEta() { return descEta; }
    public void setDescEta(String descEta) { this.descEta = descEta; }
    public Integer getDuracionEstimada() { return duracionEstimada; }
    public void setDuracionEstimada(Integer duracionEstimada) { this.duracionEstimada = duracionEstimada; }
    public Integer getOrdenSecuencia() { return ordenSecuencia; }
    public void setOrdenSecuencia(Integer ordenSecuencia) { this.ordenSecuencia = ordenSecuencia; }
    public String getCodEta() { return codEta; }
    public void setCodEta(String codEta) { this.codEta = codEta; }

}
