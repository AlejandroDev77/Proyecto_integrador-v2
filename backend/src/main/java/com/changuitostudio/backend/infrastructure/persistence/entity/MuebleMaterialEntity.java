package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "mueble_material")
public class MuebleMaterialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mue_mat")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mue")
    private MuebleEntity mueble;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mat")
    private MaterialEntity material;

    @Column(name = "cantidad")
    private Double cantidad;

    @Column(name = "cod_mue_mat")
    private String codMueMat;

    @Column(name = "est_mue_mat")
    private Boolean estMueMat;



    public MuebleMaterialEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public MuebleEntity getMueble() { return mueble; }
    public void setMueble(MuebleEntity mueble) { this.mueble = mueble; }
    public MaterialEntity getMaterial() { return material; }
    public void setMaterial(MaterialEntity material) { this.material = material; }
    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
    public String getCodMueMat() { return codMueMat; }
    public void setCodMueMat(String codMueMat) { this.codMueMat = codMueMat; }
    public Boolean getEstMueMat() { return estMueMat; }
    public void setEstMueMat(Boolean estMueMat) { this.estMueMat = estMueMat; }

}
