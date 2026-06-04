package com.changuitostudio.backend.application.dto.negocio;

import java.util.List;

public class CompraCompletaRequest {

    private CompraData compra;
    private List<DetalleCompraData> detalles;

    public CompraCompletaRequest() {}

    public CompraData getCompra() { return compra; }
    public void setCompra(CompraData compra) { this.compra = compra; }

    public List<DetalleCompraData> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleCompraData> detalles) { this.detalles = detalles; }

    public static class CompraData {
        private String fecComp;
        private Long idProv;
        private Long idEmp;

        public String getFecComp() { return fecComp; }
        public void setFecComp(String fecComp) { this.fecComp = fecComp; }
        public Long getIdProv() { return idProv; }
        public void setIdProv(Long idProv) { this.idProv = idProv; }
        public Long getIdEmp() { return idEmp; }
        public void setIdEmp(Long idEmp) { this.idEmp = idEmp; }
    }

    public static class DetalleCompraData {
        private Long idMat;
        private Double cantidad;
        private Double precioUnitario;

        public Long getIdMat() { return idMat; }
        public void setIdMat(Long idMat) { this.idMat = idMat; }
        public Double getCantidad() { return cantidad; }
        public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    }
}
