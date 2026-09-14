package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "diseños")
public class DisenoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dis")
    private Long id;

    @Column(name = "nom_dis")
    private String nomDis;

    @Column(name = "desc_dis")
    private String descDis;

    @Column(name = "archivo_3d")
    private String archivo3d;

    @Column(name = "img_dis")
    private String imgDis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cot")
    private CotizacionEntity cotizacion;

    @Column(name = "cod_dis")
    private String codDis;



    public DisenoEntity() {
    }



    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomDis() { return nomDis; }
    public void setNomDis(String nomDis) { this.nomDis = nomDis; }
    public String getDescDis() { return descDis; }
    public void setDescDis(String descDis) { this.descDis = descDis; }
    public String getArchivo3d() { return archivo3d; }
    public void setArchivo3d(String archivo3d) { this.archivo3d = archivo3d; }
    public String getImgDis() { return imgDis; }
    public void setImgDis(String imgDis) { this.imgDis = imgDis; }
    public CotizacionEntity getCotizacion() { return cotizacion; }
    public void setCotizacion(CotizacionEntity cotizacion) { this.cotizacion = cotizacion; }
    public String getCodDis() { return codDis; }
    public void setCodDis(String codDis) { this.codDis = codDis; }

}
