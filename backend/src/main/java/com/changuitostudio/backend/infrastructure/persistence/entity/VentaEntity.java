package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ventas")
public class VentaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ven")
    private Long id;

    @Column(name = "fec_ven")
    private LocalDate fecVen;

    @Column(name = "est_ven")
    private String estVen;

    @Column(name = "total_ven")
    private Double totalVen;

    @Column(name = "descuento")
    private Double descuento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cli")
    private ClienteEntity cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emp")
    private EmpleadoEntity empleado;

    @Column(name = "notas")
    private String notas;

    @Column(name = "cod_ven")
    private String codVen;



    public VentaEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecVen() { return fecVen; }
    public void setFecVen(LocalDate fecVen) { this.fecVen = fecVen; }
    public String getEstVen() { return estVen; }
    public void setEstVen(String estVen) { this.estVen = estVen; }
    public Double getTotalVen() { return totalVen; }
    public void setTotalVen(Double totalVen) { this.totalVen = totalVen; }
    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }
    public ClienteEntity getCliente() { return cliente; }
    public void setCliente(ClienteEntity cliente) { this.cliente = cliente; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getCodVen() { return codVen; }
    public void setCodVen(String codVen) { this.codVen = codVen; }

}
