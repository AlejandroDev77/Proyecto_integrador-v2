package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "produccion")
public class ProduccionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pro")
    private Long id;

    @Column(name = "fec_ini")
    private LocalDate fecIni;

    @Column(name = "fec_fin_estimada")
    private LocalDate fecFinEstimada;

    @Column(name = "fec_fin")
    private LocalDate fecFin;

    @Column(name = "est_pro")
    private String estPro;

    @Column(name = "prioridad")
    private String prioridad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ven")
    private VentaEntity venta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cot")
    private CotizacionEntity cotizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emp")
    private EmpleadoEntity empleado;

    @Column(name = "notas")
    private String notas;

    @Column(name = "cod_pro")
    private String codPro;



    public ProduccionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecIni() { return fecIni; }
    public void setFecIni(LocalDate fecIni) { this.fecIni = fecIni; }
    public LocalDate getFecFinEstimada() { return fecFinEstimada; }
    public void setFecFinEstimada(LocalDate fecFinEstimada) { this.fecFinEstimada = fecFinEstimada; }
    public LocalDate getFecFin() { return fecFin; }
    public void setFecFin(LocalDate fecFin) { this.fecFin = fecFin; }
    public String getEstPro() { return estPro; }
    public void setEstPro(String estPro) { this.estPro = estPro; }
    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }
    public VentaEntity getVenta() { return venta; }
    public void setVenta(VentaEntity venta) { this.venta = venta; }
    public CotizacionEntity getCotizacion() { return cotizacion; }
    public void setCotizacion(CotizacionEntity cotizacion) { this.cotizacion = cotizacion; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getCodPro() { return codPro; }
    public void setCodPro(String codPro) { this.codPro = codPro; }

}
