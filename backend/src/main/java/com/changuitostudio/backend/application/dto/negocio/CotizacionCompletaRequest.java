package com.changuitostudio.backend.application.dto.negocio;

import java.util.List;

public class CotizacionCompletaRequest {

    private CotizacionData cotizacion;
    private List<DetalleCotizacionData> detalles;
    private CostosData costos;

    public CotizacionCompletaRequest() {}

    public CotizacionData getCotizacion() { return cotizacion; }
    public void setCotizacion(CotizacionData cotizacion) { this.cotizacion = cotizacion; }
    public List<DetalleCotizacionData> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleCotizacionData> detalles) { this.detalles = detalles; }
    public CostosData getCostos() { return costos; }
    public void setCostos(CostosData costos) { this.costos = costos; }

    public static class CotizacionData {
        private String fecCot;
        private Integer validezDias;
        private Double descuento;
        private String notas;
        private Long idCli;
        private Long idEmp;
        private Double presupuestoCliente;
        private Integer plazoEsperado;
        private Integer tiempoEntrega;
        private String direccionInstalacion;
        private String tipoProyecto;

        public String getFecCot() { return fecCot; }
        public void setFecCot(String fecCot) { this.fecCot = fecCot; }
        public Integer getValidezDias() { return validezDias; }
        public void setValidezDias(Integer validezDias) { this.validezDias = validezDias; }
        public Double getDescuento() { return descuento; }
        public void setDescuento(Double descuento) { this.descuento = descuento; }
        public String getNotas() { return notas; }
        public void setNotas(String notas) { this.notas = notas; }
        public Long getIdCli() { return idCli; }
        public void setIdCli(Long idCli) { this.idCli = idCli; }
        public Long getIdEmp() { return idEmp; }
        public void setIdEmp(Long idEmp) { this.idEmp = idEmp; }
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

    public static class DetalleCotizacionData {
        private Long idMue;
        private Integer cantidad;
        private Double precioUnitario;
        private String descPersonalizacion;
        private String nombreMueble;
        private String tipoMueble;
        private String dimensiones;
        private String materialPrincipal;
        private String colorAcabado;
        private String imgReferencia;
        private String herrajes;

        public Long getIdMue() { return idMue; }
        public void setIdMue(Long idMue) { this.idMue = idMue; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
        public String getDescPersonalizacion() { return descPersonalizacion; }
        public void setDescPersonalizacion(String descPersonalizacion) { this.descPersonalizacion = descPersonalizacion; }
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

    public static class CostosData {
        private Double costoMateriales;
        private Double costoManoObra;
        private Double costosIndirectos;
        private Double margenGanancia;

        public Double getCostoMateriales() { return costoMateriales; }
        public void setCostoMateriales(Double costoMateriales) { this.costoMateriales = costoMateriales; }
        public Double getCostoManoObra() { return costoManoObra; }
        public void setCostoManoObra(Double costoManoObra) { this.costoManoObra = costoManoObra; }
        public Double getCostosIndirectos() { return costosIndirectos; }
        public void setCostosIndirectos(Double costosIndirectos) { this.costosIndirectos = costosIndirectos; }
        public Double getMargenGanancia() { return margenGanancia; }
        public void setMargenGanancia(Double margenGanancia) { this.margenGanancia = margenGanancia; }
    }
}
