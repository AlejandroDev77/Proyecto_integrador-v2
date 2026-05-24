package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detalles_cotizacion")
public class DetalleCotizacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_det_cot")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cot")
    private CotizacionEntity cotizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mue")
    private MuebleEntity mueble;

    @Column(name = "desc_personalizacion")
    private String descPersonalizacion;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;

    @Column(name = "subtotal")
    private Double subtotal;

    @Column(name = "cod_det_cot")
    private String codDetCot;

    @Column(name = "nombre_mueble")
    private String nombreMueble;

    @Column(name = "tipo_mueble")
    private String tipoMueble;

    @Column(name = "dimensiones")
    private String dimensiones;

    @Column(name = "material_principal")
    private String materialPrincipal;

    @Column(name = "color_acabado")
    private String colorAcabado;

    @Column(name = "img_referencia")
    private String imgReferencia;

    @Column(name = "herrajes")
    private String herrajes;



    public DetalleCotizacionEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public CotizacionEntity getCotizacion() { return cotizacion; }
    public void setCotizacion(CotizacionEntity cotizacion) { this.cotizacion = cotizacion; }
    public MuebleEntity getMueble() { return mueble; }
    public void setMueble(MuebleEntity mueble) { this.mueble = mueble; }
    public String getDescPersonalizacion() { return descPersonalizacion; }
    public void setDescPersonalizacion(String descPersonalizacion) { this.descPersonalizacion = descPersonalizacion; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
    public String getCodDetCot() { return codDetCot; }
    public void setCodDetCot(String codDetCot) { this.codDetCot = codDetCot; }
    public String getNombreMueble() { return nombreMueble; }
    public void setNombreMueble(String nombreMueble) { this.nombreMueble = nombreMueble; }
    public String getTipoMueble() { return tipoMueble; }
    public void setTipoMueble(String tipoMueble) { this.tipoMueble = tipoMueble; }
    public String getDimensiones() { return dimensiones; }
    public void setDimensiones(String dimensiones) { this.dimensiones = dimensiones; }
    public String getMaterialPrincipal() { return materialPrincipal; }
    public void setMaterialPrincipal(String materialPrincipal) { this.materialPrincipal = materialPrincipal; }
    public String getColorAcabado() { return colorAcabado; }
    public void setColorAcabado(String colorAcabado) { this.colorAcabado = colorAcabado; }
    public String getImgReferencia() { return imgReferencia; }
    public void setImgReferencia(String imgReferencia) { this.imgReferencia = imgReferencia; }
    public String getHerrajes() { return herrajes; }
    public void setHerrajes(String herrajes) { this.herrajes = herrajes; }

}
