package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "pagos")
public class PagoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pag")
    private Long id;

    @Column(name = "monto")
    private Double monto;

    @Column(name = "fec_pag")
    private LocalDate fecPag;

    @Column(name = "metodo_pag")
    private String metodoPag;

    @Column(name = "referencia_pag")
    private String referenciaPag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ven")
    private VentaEntity venta;

    @Column(name = "cod_pag")
    private String codPag;



    public PagoEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }
    public LocalDate getFecPag() { return fecPag; }
    public void setFecPag(LocalDate fecPag) { this.fecPag = fecPag; }
    public String getMetodoPag() { return metodoPag; }
    public void setMetodoPag(String metodoPag) { this.metodoPag = metodoPag; }
    public String getReferenciaPag() { return referenciaPag; }
    public void setReferenciaPag(String referenciaPag) { this.referenciaPag = referenciaPag; }
    public VentaEntity getVenta() { return venta; }
    public void setVenta(VentaEntity venta) { this.venta = venta; }
    public String getCodPag() { return codPag; }
    public void setCodPag(String codPag) { this.codPag = codPag; }

}
