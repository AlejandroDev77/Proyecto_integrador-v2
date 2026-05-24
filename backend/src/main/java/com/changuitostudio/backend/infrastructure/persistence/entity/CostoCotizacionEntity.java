package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "costos_cotizacion")
public class CostoCotizacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_costo")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cot")
    private CotizacionEntity cotizacion;

    @Column(name = "costo_materiales")
    private Double costoMateriales;

    @Column(name = "costo_mano_obra")
    private Double costoManoObra;

    @Column(name = "costos_indirectos")
    private Double costosIndirectos;

    @Column(name = "margen_ganancia")
    private Double margenGanancia;

    @Column(name = "costo_total")
    private Double costoTotal;

    @Column(name = "precio_sugerido")
    private Double precioSugerido;



    public CostoCotizacionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CotizacionEntity getCotizacion() { return cotizacion; }
    public void setCotizacion(CotizacionEntity cotizacion) { this.cotizacion = cotizacion; }
    public Double getCostoMateriales() { return costoMateriales; }
    public void setCostoMateriales(Double costoMateriales) { this.costoMateriales = costoMateriales; }
    public Double getCostoManoObra() { return costoManoObra; }
    public void setCostoManoObra(Double costoManoObra) { this.costoManoObra = costoManoObra; }
    public Double getCostosIndirectos() { return costosIndirectos; }
    public void setCostosIndirectos(Double costosIndirectos) { this.costosIndirectos = costosIndirectos; }
    public Double getMargenGanancia() { return margenGanancia; }
    public void setMargenGanancia(Double margenGanancia) { this.margenGanancia = margenGanancia; }
    public Double getCostoTotal() { return costoTotal; }
    public void setCostoTotal(Double costoTotal) { this.costoTotal = costoTotal; }
    public Double getPrecioSugerido() { return precioSugerido; }
    public void setPrecioSugerido(Double precioSugerido) { this.precioSugerido = precioSugerido; }

}
