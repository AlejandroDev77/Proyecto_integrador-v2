package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cotizaciones")
public class CotizacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cot")
    private Long id;

    @Column(name = "fec_cot")
    private LocalDate fecCot;

    @Column(name = "est_cot")
    private String estCot;

    @Column(name = "validez_dias")
    private Integer validezDias;

    @Column(name = "total_cot")
    private Double totalCot;

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

    @Column(name = "cod_cot")
    private String codCot;

    @Column(name = "presupuesto_cliente")
    private Double presupuestoCliente;

    @Column(name = "plazo_esperado")
    private Integer plazoEsperado;

    @Column(name = "tiempo_entrega")
    private Integer tiempoEntrega;

    @Column(name = "direccion_instalacion")
    private String direccionInstalacion;

    @Column(name = "tipo_proyecto")
    private String tipoProyecto;



    public CotizacionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecCot() { return fecCot; }
    public void setFecCot(LocalDate fecCot) { this.fecCot = fecCot; }
    public String getEstCot() { return estCot; }
    public void setEstCot(String estCot) { this.estCot = estCot; }
    public Integer getValidezDias() { return validezDias; }
    public void setValidezDias(Integer validezDias) { this.validezDias = validezDias; }
    public Double getTotalCot() { return totalCot; }
    public void setTotalCot(Double totalCot) { this.totalCot = totalCot; }
    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }
    public ClienteEntity getCliente() { return cliente; }
    public void setCliente(ClienteEntity cliente) { this.cliente = cliente; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getCodCot() { return codCot; }
    public void setCodCot(String codCot) { this.codCot = codCot; }
    public Double getPresupuestoCliente() { return presupuestoCliente; }
    public void setPresupuestoCliente(Double presupuestoCliente) { this.presupuestoCliente = presupuestoCliente; }
    public Integer getPlazoEsperado() { return plazoEsperado; }
    public void setPlazoEsperado(Integer plazoEsperado) { this.plazoEsperado = plazoEsperado; }
    public Integer getTiempoEntrega() { return tiempoEntrega; }
    public void setTiempoEntrega(Integer tiempoEntrega) { this.tiempoEntrega = tiempoEntrega; }
    public String getDireccionInstalacion() { return direccionInstalacion; }
    public void setDireccionInstalacion(String direccionInstalacion) { this.direccionInstalacion = direccionInstalacion; }
    public String getTipoProyecto() { return tipoProyecto; }
    public void setTipoProyecto(String tipoProyecto) { this.tipoProyecto = tipoProyecto; }

}
