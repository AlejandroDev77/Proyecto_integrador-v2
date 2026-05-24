package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "generaciones_ia")
public class GeneracionIAEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_gen")
    private Long idGen;

    @Column(name = "nom_mue", nullable = false)
    private String nomMue;

    @ElementCollection
    @CollectionTable(name = "generacion_ia_imagenes", joinColumns = @JoinColumn(name = "id_gen"))
    @Column(name = "img_url")
    private List<String> imgsRef;

    @Column(name = "modelo_3d")
    private String modelo3d;

    @Column(name = "estado")
    private String estado = "procesando";

    @Column(name = "fec_crea")
    private LocalDateTime fecCrea = LocalDateTime.now();

    @Column(name = "id_mue")
    private Long idMue;

    public GeneracionIAEntity() {
    }

    public Long getIdGen() {
        return idGen;
    }

    public void setIdGen(Long idGen) {
        this.idGen = idGen;
    }

    public String getNomMue() {
        return nomMue;
    }

    public void setNomMue(String nomMue) {
        this.nomMue = nomMue;
    }

    public List<String> getImgsRef() {
        return imgsRef;
    }

    public void setImgsRef(List<String> imgsRef) {
        this.imgsRef = imgsRef;
    }

    public String getModelo3d() {
        return modelo3d;
    }

    public void setModelo3d(String modelo3d) {
        this.modelo3d = modelo3d;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecCrea() {
        return fecCrea;
    }

    public void setFecCrea(LocalDateTime fecCrea) {
        this.fecCrea = fecCrea;
    }

    public Long getIdMue() {
        return idMue;
    }

    public void setIdMue(Long idMue) {
        this.idMue = idMue;
    }
}
