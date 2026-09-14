package com.changuitostudio.backend.domain.model;

public class Mueble {

    private Long id;
    private String codigo;
    private String nombre;
    private String imagen;
    private Double precioVenta;
    private Double precioCosto;
    private String descripcion;
    private Integer stock;
    private Integer stockMinimo;
    private String modelo3d;
    private String dimensiones;
    private Boolean estado;
    private Categoria categoria;

    public Mueble() {
    }

    public Mueble(Long id, String codigo, String nombre, String imagen, Double precioVenta) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precioVenta = precioVenta;
    }

    public Mueble(Long id, String codigo, String nombre, String imagen, Double precioVenta, Double precioCosto,
                  String descripcion, Integer stock, Integer stockMinimo, String modelo3d, String dimensiones, Boolean estado, Categoria categoria) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precioVenta = precioVenta;
        this.precioCosto = precioCosto;
        this.descripcion = descripcion;
        this.stock = stock;
        this.stockMinimo = stockMinimo;
        this.modelo3d = modelo3d;
        this.dimensiones = dimensiones;
        this.estado = estado;
        this.categoria = categoria;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Double getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(Double precioVenta) {
        this.precioVenta = precioVenta;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getModelo3d() {
        return modelo3d;
    }

    public void setModelo3d(String modelo3d) {
        this.modelo3d = modelo3d;
    }

    public String getDimensiones() {
        return dimensiones;
    }

    public void setDimensiones(String dimensiones) {
        this.dimensiones = dimensiones;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Double getPrecioCosto() {
        return precioCosto;
    }

    public void setPrecioCosto(Double precioCosto) {
        this.precioCosto = precioCosto;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Mueble mueble = (Mueble) o;
        return java.util.Objects.equals(id, mueble.id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Mueble{" +
                "id=" + id +
                ", codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", imagen='" + imagen + '\'' +
                ", precioVenta=" + precioVenta +
                ", descripcion='" + descripcion + '\'' +
                ", stock=" + stock +
                ", modelo3d='" + modelo3d + '\'' +
                ", dimensiones='" + dimensiones + '\'' +
                ", estado=" + estado +
                ", categoria=" + categoria +
                '}';
    }
}
