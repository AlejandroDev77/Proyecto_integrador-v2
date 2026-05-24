package com.changuitostudio.backend.application.dto.negocio;

import java.util.List;

public class DevolucionRequest {

    private DevolucionData devolucion;
    private List<DetalleDevolucionData> detalles;

    public DevolucionRequest() {}

    public DevolucionData getDevolucion() { return devolucion; }
    public void setDevolucion(DevolucionData devolucion) { this.devolucion = devolucion; }

    public List<DetalleDevolucionData> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleDevolucionData> detalles) { this.detalles = detalles; }

    public static class DevolucionData {
        private String fecDev;
        private String motivoDev;
        private Long idVen;
        private Long idEmp;

        public String getFecDev() { return fecDev; }
        public void setFecDev(String fecDev) { this.fecDev = fecDev; }
        public String getMotivoDev() { return motivoDev; }
        public void setMotivoDev(String motivoDev) { this.motivoDev = motivoDev; }
        public Long getIdVen() { return idVen; }
        public void setIdVen(Long idVen) { this.idVen = idVen; }
        public Long getIdEmp() { return idEmp; }
        public void setIdEmp(Long idEmp) { this.idEmp = idEmp; }
    }

    public static class DetalleDevolucionData {
        private Long idMue;
        private Integer cantidad;
        private Double precioUnitario;

        public Long getIdMue() { return idMue; }
        public void setIdMue(Long idMue) { this.idMue = idMue; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    }
}
