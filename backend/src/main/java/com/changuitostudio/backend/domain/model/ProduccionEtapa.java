package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class ProduccionEtapa {
    private Long id;
    private Produccion produccion;
    private EtapaProduccion etapaProduccion;
    private LocalDate fecIni;
    private LocalDate fecFin;
    private String estEta;
    private Empleado empleado;
    private String notas;
    private String codProEta;
    private String fotosProgreso;

    public ProduccionEtapa() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Produccion getProduccion() {
        return produccion;
    }

    public void setProduccion(Produccion produccion) {
        this.produccion = produccion;
    }
    public EtapaProduccion getEtapaProduccion() {
        return etapaProduccion;
    }

    public void setEtapaProduccion(EtapaProduccion etapaProduccion) {
        this.etapaProduccion = etapaProduccion;
    }
    public LocalDate getFecIni() {
        return fecIni;
    }

    public void setFecIni(LocalDate fecIni) {
        this.fecIni = fecIni;
    }
    public LocalDate getFecFin() {
        return fecFin;
    }

    public void setFecFin(LocalDate fecFin) {
        this.fecFin = fecFin;
    }
    public String getEstEta() {
        return estEta;
    }

    public void setEstEta(String estEta) {
        this.estEta = estEta;
    }
    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
    public String getCodProEta() {
        return codProEta;
    }

    public void setCodProEta(String codProEta) {
        this.codProEta = codProEta;
    }
    public String getFotosProgreso() {
        return fotosProgreso;
    }

    public void setFotosProgreso(String fotosProgreso) {
        this.fotosProgreso = fotosProgreso;
    }
}
