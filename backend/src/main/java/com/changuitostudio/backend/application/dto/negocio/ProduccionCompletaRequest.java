package com.changuitostudio.backend.application.dto.negocio;

import java.util.List;

public class ProduccionCompletaRequest {

    private ProduccionData produccion;
    private List<DetalleProduccionData> detalles;
    private List<Long> etapas;

    public ProduccionCompletaRequest() {}

    public ProduccionData getProduccion() { return produccion; }
    public void setProduccion(ProduccionData produccion) { this.produccion = produccion; }
    public List<DetalleProduccionData> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleProduccionData> detalles) { this.detalles = detalles; }
    public List<Long> getEtapas() { return etapas; }
    public void setEtapas(List<Long> etapas) { this.etapas = etapas; }

    public static class ProduccionData {
        private String fecIni;
        private String fecFinEstimada;
        private String prioridad;
        private Long idVen;
        private Long idCot;
        private Long idEmp;
        private String notas;

        public String getFecIni() { return fecIni; }
        public void setFecIni(String fecIni) { this.fecIni = fecIni; }
        public String getFecFinEstimada() { return fecFinEstimada; }
        public void setFecFinEstimada(String fecFinEstimada) { this.fecFinEstimada = fecFinEstimada; }
        public String getPrioridad() { return prioridad; }
        public void setPrioridad(String prioridad) { this.prioridad = prioridad; }
        public Long getIdVen() { return idVen; }
        public void setIdVen(Long idVen) { this.idVen = idVen; }
        public Long getIdCot() { return idCot; }
        public void setIdCot(Long idCot) { this.idCot = idCot; }
        public Long getIdEmp() { return idEmp; }
        public void setIdEmp(Long idEmp) { this.idEmp = idEmp; }
        public String getNotas() { return notas; }
        public void setNotas(String notas) { this.notas = notas; }
    }

    public static class DetalleProduccionData {
        private Long idMue;
        private Integer cantidad;
        private String nombreMueble;

        public Long getIdMue() { return idMue; }
        public void setIdMue(Long idMue) { this.idMue = idMue; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public String getNombreMueble() { return nombreMueble; }
        public void setNombreMueble(String nombreMueble) { this.nombreMueble = nombreMueble; }
    }
}
