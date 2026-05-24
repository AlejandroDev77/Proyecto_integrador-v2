package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "produccion_etapas")
public class ProduccionEtapaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pro_eta")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pro")
    private ProduccionEntity produccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_eta")
    private EtapaProduccionEntity etapaProduccion;

    @Column(name = "fec_ini")
    private LocalDate fecIni;

    @Column(name = "fec_fin")
    private LocalDate fecFin;

    @Column(name = "est_eta")
    private String estEta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emp")
    private EmpleadoEntity empleado;

    @Column(name = "notas")
    private String notas;

    @Column(name = "cod_pro_eta")
    private String codProEta;

    @Column(name = "fotos_progreso")
    private String fotosProgreso;



    public ProduccionEtapaEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ProduccionEntity getProduccion() { return produccion; }
    public void setProduccion(ProduccionEntity produccion) { this.produccion = produccion; }
    public EtapaProduccionEntity getEtapaProduccion() { return etapaProduccion; }
    public void setEtapaProduccion(EtapaProduccionEntity etapaProduccion) { this.etapaProduccion = etapaProduccion; }
    public LocalDate getFecIni() { return fecIni; }
    public void setFecIni(LocalDate fecIni) { this.fecIni = fecIni; }
    public LocalDate getFecFin() { return fecFin; }
    public void setFecFin(LocalDate fecFin) { this.fecFin = fecFin; }
    public String getEstEta() { return estEta; }
    public void setEstEta(String estEta) { this.estEta = estEta; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getCodProEta() { return codProEta; }
    public void setCodProEta(String codProEta) { this.codProEta = codProEta; }
    public String getFotosProgreso() { return fotosProgreso; }
    public void setFotosProgreso(String fotosProgreso) { this.fotosProgreso = fotosProgreso; }

}
