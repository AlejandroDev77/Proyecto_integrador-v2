package com.changuitostudio.backend.application.dto.negocio;

import java.util.List;

public class AprobarCotizacionRequest {

    private List<DetalleUpdate> detalles;
    private Double descuento;
    private String notasAdmin;

    public AprobarCotizacionRequest() {}

    public List<DetalleUpdate> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleUpdate> detalles) { this.detalles = detalles; }

    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }

    public String getNotasAdmin() { return notasAdmin; }
    public void setNotasAdmin(String notasAdmin) { this.notasAdmin = notasAdmin; }

    public static class DetalleUpdate {
        private Long idDetCot;
        private Double precioUnitario;

        public Long getIdDetCot() { return idDetCot; }
        public void setIdDetCot(Long idDetCot) { this.idDetCot = idDetCot; }
        public Double getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    }
}
