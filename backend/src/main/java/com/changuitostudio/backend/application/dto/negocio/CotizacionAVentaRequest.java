package com.changuitostudio.backend.application.dto.negocio;

public class CotizacionAVentaRequest {

    private Long idEmp;
    private boolean registrarPago;
    private PagoData pago;

    public CotizacionAVentaRequest() {}

    public Long getIdEmp() { return idEmp; }
    public void setIdEmp(Long idEmp) { this.idEmp = idEmp; }

    public boolean isRegistrarPago() { return registrarPago; }
    public void setRegistrarPago(boolean registrarPago) { this.registrarPago = registrarPago; }

    public PagoData getPago() { return pago; }
    public void setPago(PagoData pago) { this.pago = pago; }

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
