package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "compras_materiales")
public class CompraMaterialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comp")
    private Long id;

    @Column(name = "fec_comp")
    private LocalDate fecComp;

    @Column(name = "est_comp")
    private String estComp;

    @Column(name = "total_comp")
    private Double totalComp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prov")
    private ProveedorEntity proveedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_emp")
    private EmpleadoEntity empleado;

    @Column(name = "cod_comp")
    private String codComp;



    public CompraMaterialEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecComp() { return fecComp; }
    public void setFecComp(LocalDate fecComp) { this.fecComp = fecComp; }
    public String getEstComp() { return estComp; }
    public void setEstComp(String estComp) { this.estComp = estComp; }
    public Double getTotalComp() { return totalComp; }
    public void setTotalComp(Double totalComp) { this.totalComp = totalComp; }
    public ProveedorEntity getProveedor() { return proveedor; }
    public void setProveedor(ProveedorEntity proveedor) { this.proveedor = proveedor; }
    public EmpleadoEntity getEmpleado() { return empleado; }
    public void setEmpleado(EmpleadoEntity empleado) { this.empleado = empleado; }
    public String getCodComp() { return codComp; }
    public void setCodComp(String codComp) { this.codComp = codComp; }

}
