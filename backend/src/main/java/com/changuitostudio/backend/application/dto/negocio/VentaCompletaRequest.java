package com.changuitostudio.backend.application.dto.negocio;

import java.util.List;

public class VentaCompletaRequest {

    private VentaData venta;
    private List<DetalleVentaData> detalles;
    private PagoData pago;

    public VentaCompletaRequest() {}

    public VentaData getVenta() { return venta; }
    public void setVenta(VentaData venta) { this.venta = venta; }

    public List<DetalleVentaData> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaData> detalles) { this.detalles = detalles; }

    public PagoData getPago() { return pago; }
    public void setPago(PagoData pago) { this.pago = pago; }

    public static class VentaData {
        private String fecVen;
        private String estVen;
        private Double totalVen;
        private Double descuento;
        private Long idCli;
        private Long idEmp;
        private String notas;

        public String getFecVen() { return fecVen; }
        public void setFecVen(String fecVen) { this.fecVen = fecVen; }
        public String getEstVen() { return estVen; }
        public void setEstVen(String estVen) { this.estVen = estVen; }
        public Double getTotalVen() { return totalVen; }
        public void setTotalVen(Double totalVen) { this.totalVen = totalVen; }
        public Double getDescuento() { return descuento; }
        public void setDescuento(Double descuento) { this.descuento = descuento; }
        public Long getIdCli() { return idCli; }
        public void setIdCli(Long idCli) { this.idCli = idCli; }
        public Long getIdEmp() { return idEmp; }
        public void setIdEmp(Long idEmp) { this.idEmp = idEmp; }
        public String getNotas() { return notas; }
        public void setNotas(String notas) { this.notas = notas; }
    }

    public static class DetalleVentaData {
        private Long idMue;
        private Integer cantidad;
        private Double precioUnitario;
        private Double descuentoItem;

        public Long getIdMue() { return idMue; }
        public void setIdMue(Long idMue) { this.idMue = idMue; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
        public Double getDescuentoItem() { return descuentoItem; }
        public void setDescuentoItem(Double descuentoItem) { this.descuentoItem = descuentoItem; }
    }

    public static class PagoData {
        private Double monto;
        private String metodoPag;
        private String referenciaPag;

        public Double getMonto() { return monto; }
        public void setMonto(Double monto) { this.monto = monto; }
        public String getMetodoPag() { return metodoPag; }
        public void setMetodoPag(String metodoPag) { this.metodoPag = metodoPag; }
        public String getReferenciaPag() { return referenciaPag; }
        public void setReferenciaPag(String referenciaPag) { this.referenciaPag = referenciaPag; }
    }
}
