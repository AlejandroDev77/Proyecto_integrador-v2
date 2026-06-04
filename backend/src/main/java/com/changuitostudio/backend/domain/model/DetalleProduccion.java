package com.changuitostudio.backend.domain.model;


public class DetalleProduccion {
    private Long id;
    private Produccion produccion;
    private Mueble mueble;
    private Integer cantidad;
    private String estDetPro;
    private String codDetPro;

    public DetalleProduccion() {
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
    public Mueble getMueble() {
        return mueble;
    }

    public void setMueble(Mueble mueble) {
        this.mueble = mueble;
    }
    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public String getEstDetPro() {
        return estDetPro;
    }

    public void setEstDetPro(String estDetPro) {
        this.estDetPro = estDetPro;
    }
    public String getCodDetPro() {
        return codDetPro;
    }

    public void setCodDetPro(String codDetPro) {
        this.codDetPro = codDetPro;
    }
}
