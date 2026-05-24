package com.changuitostudio.backend.domain.model;


public class DetalleCotizacion {
    private Long id;
    private Cotizacion cotizacion;
    private Mueble mueble;
    private String descPersonalizacion;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private String codDetCot;
    private String nombreMueble;
    private String tipoMueble;
    private String dimensiones;
    private String materialPrincipal;
    private String colorAcabado;
    private String imgReferencia;
    private String herrajes;

    public DetalleCotizacion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Cotizacion getCotizacion() {
        return cotizacion;
    }

    public void setCotizacion(Cotizacion cotizacion) {
        this.cotizacion = cotizacion;
    }
    public Mueble getMueble() {
        return mueble;
    }

    public void setMueble(Mueble mueble) {
        this.mueble = mueble;
    }
    public String getDescPersonalizacion() {
        return descPersonalizacion;
    }

    public void setDescPersonalizacion(String descPersonalizacion) {
        this.descPersonalizacion = descPersonalizacion;
    }
    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
    public String getCodDetCot() {
        return codDetCot;
    }

    public void setCodDetCot(String codDetCot) {
        this.codDetCot = codDetCot;
    }
    public String getNombreMueble() {
        return nombreMueble;
    }

    public void setNombreMueble(String nombreMueble) {
        this.nombreMueble = nombreMueble;
    }
    public String getTipoMueble() {
        return tipoMueble;
    }

    public void setTipoMueble(String tipoMueble) {
        this.tipoMueble = tipoMueble;
    }
    public String getDimensiones() {
        return dimensiones;
    }

    public void setDimensiones(String dimensiones) {
        this.dimensiones = dimensiones;
    }
    public String getMaterialPrincipal() {
        return materialPrincipal;
    }

    public void setMaterialPrincipal(String materialPrincipal) {
        this.materialPrincipal = materialPrincipal;
    }
    public String getColorAcabado() {
        return colorAcabado;
    }

    public void setColorAcabado(String colorAcabado) {
        this.colorAcabado = colorAcabado;
    }
    public String getImgReferencia() {
        return imgReferencia;
    }

    public void setImgReferencia(String imgReferencia) {
        this.imgReferencia = imgReferencia;
    }
    public String getHerrajes() {
        return herrajes;
    }

    public void setHerrajes(String herrajes) {
        this.herrajes = herrajes;
    }
}
