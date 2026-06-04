package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "empleados")
public class EmpleadoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_emp")
    private Long id;

    @Column(name = "nom_emp")
    private String nomEmp;

    @Column(name = "ap_pat_emp")
    private String apPatEmp;

    @Column(name = "ap_mat_emp")
    private String apMatEmp;

    @Column(name = "cel_emp")
    private String celEmp;

    @Column(name = "dir_emp")
    private String dirEmp;

    @Column(name = "fec_nac_emp")
    private LocalDate fecNacEmp;

    @Column(name = "img_emp")
    private String imgEmp;

    @Column(name = "car_emp")
    private String carEmp;

    @Column(name = "ci_emp")
    private String ciEmp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usu")
    private UsuarioEntity usuario;

    @Column(name = "cod_emp")
    private String codEmp;

    @Column(name = "est_emp")
    private Boolean estEmp;



    public EmpleadoEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomEmp() { return nomEmp; }
    public void setNomEmp(String nomEmp) { this.nomEmp = nomEmp; }
    public String getApPatEmp() { return apPatEmp; }
    public void setApPatEmp(String apPatEmp) { this.apPatEmp = apPatEmp; }
    public String getApMatEmp() { return apMatEmp; }
    public void setApMatEmp(String apMatEmp) { this.apMatEmp = apMatEmp; }
    public String getCelEmp() { return celEmp; }
    public void setCelEmp(String celEmp) { this.celEmp = celEmp; }
    public String getDirEmp() { return dirEmp; }
    public void setDirEmp(String dirEmp) { this.dirEmp = dirEmp; }
    public LocalDate getFecNacEmp() { return fecNacEmp; }
    public void setFecNacEmp(LocalDate fecNacEmp) { this.fecNacEmp = fecNacEmp; }
    public String getImgEmp() { return imgEmp; }
    public void setImgEmp(String imgEmp) { this.imgEmp = imgEmp; }
    public String getCarEmp() { return carEmp; }
    public void setCarEmp(String carEmp) { this.carEmp = carEmp; }
    public String getCiEmp() { return ciEmp; }
    public void setCiEmp(String ciEmp) { this.ciEmp = ciEmp; }
    public UsuarioEntity getUsuario() { return usuario; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }
    public String getCodEmp() { return codEmp; }
    public void setCodEmp(String codEmp) { this.codEmp = codEmp; }
    public Boolean getEstEmp() { return estEmp; }
    public void setEstEmp(Boolean estEmp) { this.estEmp = estEmp; }

}
