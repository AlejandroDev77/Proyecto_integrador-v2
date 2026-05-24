package com.changuitostudio.backend.domain.model;

import java.time.LocalDate;

public class CompraMaterial {
    private Long id;
    private LocalDate fecComp;
    private String estComp;
    private Double totalComp;
    private Proveedor proveedor;
    private Empleado empleado;
    private String codComp;

    public CompraMaterial() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public LocalDate getFecComp() {
        return fecComp;
    }

    public void setFecComp(LocalDate fecComp) {
        this.fecComp = fecComp;
    }
    public String getEstComp() {
        return estComp;
    }

    public void setEstComp(String estComp) {
        this.estComp = estComp;
    }
    public Double getTotalComp() {
        return totalComp;
    }

    public void setTotalComp(Double totalComp) {
        this.totalComp = totalComp;
    }
    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }
    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    public String getCodComp() {
        return codComp;
    }

    public void setCodComp(String codComp) {
        this.codComp = codComp;
    }
}
