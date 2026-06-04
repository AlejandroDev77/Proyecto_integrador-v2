package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidencias_produccion")
public class EvidenciaProduccionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evi")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pro_eta")
    private ProduccionEtapaEntity produccionEtapa;

    @Column(name = "tipo_evi")
    private String tipoEvi;

    @Column(name = "archivo_evi")
    private String archivoEvi;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fec_evi")
    private LocalDateTime fecEvi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emp")
    private EmpleadoEntity empleado;

    @Column(name = "cod_evi")
    private String codEvi;



    public EvidenciaProduccionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ProduccionEtapaEntity getProduccionEtapa() { return produccionEtapa; }
    public void setProduccionEtapa(ProduccionEtapaEntity produccionEtapa) { this.produccionEtapa = produccionEtapa; }
    public String getTipoEvi() { return tipoEvi; }
    public void setTipoEvi(String tipoEvi) { this.tipoEvi = tipoEvi; }
    public String getArchivoEvi() { return archivoEvi; }
    public void setArchivoEvi(String archivoEvi) { this.archivoEvi = archivoEvi; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDateTime getFecEvi() { return fecEvi; }
    public void setFecEvi(LocalDateTime fecEvi) { this.fecEvi = fecEvi; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getCodEvi() { return codEvi; }
    public void setCodEvi(String codEvi) { this.codEvi = codEvi; }

}
