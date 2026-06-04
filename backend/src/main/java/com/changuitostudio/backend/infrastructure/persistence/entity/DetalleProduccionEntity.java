package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detalles_produccion")
public class DetalleProduccionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_det_pro")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pro")
    private ProduccionEntity produccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mue")
    private MuebleEntity mueble;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "est_det_pro")
    private String estDetPro;

    @Column(name = "cod_det_pro")
    private String codDetPro;



    public DetalleProduccionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ProduccionEntity getProduccion() { return produccion; }
    public void setProduccion(ProduccionEntity produccion) { this.produccion = produccion; }
    public MuebleEntity getMueble() { return mueble; }
    public void setMueble(MuebleEntity mueble) { this.mueble = mueble; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getEstDetPro() { return estDetPro; }
    public void setEstDetPro(String estDetPro) { this.estDetPro = estDetPro; }
    public String getCodDetPro() { return codDetPro; }
    public void setCodDetPro(String codDetPro) { this.codDetPro = codDetPro; }

}
