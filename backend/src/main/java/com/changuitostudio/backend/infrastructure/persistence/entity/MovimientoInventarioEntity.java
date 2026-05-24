package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario")
public class MovimientoInventarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mov")
    private Long id;

    @Column(name = "tipo_mov")
    private String tipoMov;

    @Column(name = "fecha_mov")
    private LocalDateTime fechaMov;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mat")
    private MaterialEntity material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mue")
    private MuebleEntity mueble;

    @Column(name = "cantidad")
    private Double cantidad;

    @Column(name = "stock_anterior")
    private Double stockAnterior;

    @Column(name = "stock_posterior")
    private Double stockPosterior;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ven")
    private VentaEntity venta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pro")
    private ProduccionEntity produccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_comp")
    private CompraMaterialEntity compra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dev")
    private DevolucionEntity devolucion;

    @Column(name = "motivo")
    private String motivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emp")
    private EmpleadoEntity empleado;

    @Column(name = "cod_mov")
    private String codMov;



    public MovimientoInventarioEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipoMov() { return tipoMov; }
    public void setTipoMov(String tipoMov) { this.tipoMov = tipoMov; }
    public LocalDateTime getFechaMov() { return fechaMov; }
    public void setFechaMov(LocalDateTime fechaMov) { this.fechaMov = fechaMov; }
    public MaterialEntity getMaterial() { return material; }
    public void setMaterial(MaterialEntity material) { this.material = material; }
    public MuebleEntity getMueble() { return mueble; }
    public void setMueble(MuebleEntity mueble) { this.mueble = mueble; }
    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
    public Double getStockAnterior() { return stockAnterior; }
    public void setStockAnterior(Double stockAnterior) { this.stockAnterior = stockAnterior; }
    public Double getStockPosterior() { return stockPosterior; }
    public void setStockPosterior(Double stockPosterior) { this.stockPosterior = stockPosterior; }
    public VentaEntity getVenta() { return venta; }
    public void setVenta(VentaEntity venta) { this.venta = venta; }
    public ProduccionEntity getProduccion() { return produccion; }
    public void setProduccion(ProduccionEntity produccion) { this.produccion = produccion; }
    public CompraMaterialEntity getCompra() { return compra; }
    public void setCompra(CompraMaterialEntity compra) { this.compra = compra; }
    public DevolucionEntity getDevolucion() { return devolucion; }
    public void setDevolucion(DevolucionEntity devolucion) { this.devolucion = devolucion; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getCodMov() { return codMov; }
    public void setCodMov(String codMov) { this.codMov = codMov; }

}
