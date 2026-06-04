package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class Pago {
    private Long id;
    private Double monto;
    private LocalDate fecPag;
    private String metodoPag;
    private String referenciaPag;
    private Venta venta;
    private String codPag;

    public Pago() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }
    public LocalDate getFecPag() {
        return fecPag;
    }

    public void setFecPag(LocalDate fecPag) {
        this.fecPag = fecPag;
    }
    public String getMetodoPag() {
        return metodoPag;
    }

    public void setMetodoPag(String metodoPag) {
        this.metodoPag = metodoPag;
    }
    public String getReferenciaPag() {
        return referenciaPag;
    }

    public void setReferenciaPag(String referenciaPag) {
        this.referenciaPag = referenciaPag;
    }
    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }
    public String getCodPag() {
        return codPag;
    }

    public void setCodPag(String codPag) {
        this.codPag = codPag;
    }
}
