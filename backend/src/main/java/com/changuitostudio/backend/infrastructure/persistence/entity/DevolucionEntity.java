package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "devoluciones")
public class DevolucionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dev")
    private Long id;

    @Column(name = "fec_dev")
    private LocalDate fecDev;

    @Column(name = "motivo_dev")
    private String motivoDev;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ven")
    private VentaEntity venta;

    @Column(name = "total_dev")
    private Double totalDev;

    @Column(name = "est_dev")
    private String estDev;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emp")
    private EmpleadoEntity empleado;

    @Column(name = "cod_dev")
    private String codDev;



    public DevolucionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecDev() { return fecDev; }
    public void setFecDev(LocalDate fecDev) { this.fecDev = fecDev; }
    public String getMotivoDev() { return motivoDev; }
    public void setMotivoDev(String motivoDev) { this.motivoDev = motivoDev; }
    public VentaEntity getVenta() { return venta; }
    public void setVenta(VentaEntity venta) { this.venta = venta; }
    public Double getTotalDev() { return totalDev; }
    public void setTotalDev(Double totalDev) { this.totalDev = totalDev; }
    public String getEstDev() { return estDev; }
    public void setEstDev(String estDev) { this.estDev = estDev; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getCodDev() { return codDev; }
    public void setCodDev(String codDev) { this.codDev = codDev; }

}
