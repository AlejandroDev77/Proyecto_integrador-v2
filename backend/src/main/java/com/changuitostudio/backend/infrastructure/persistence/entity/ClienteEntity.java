package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "clientes")
public class ClienteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cli")
    private Long id;

    @Column(name = "nom_cli")
    private String nomCli;

    @Column(name = "ap_pat_cli")
    private String apPatCli;

    @Column(name = "ap_mat_cli")
    private String apMatCli;

    @Column(name = "cel_cli")
    private String celCli;

    @Column(name = "dir_cli")
    private String dirCli;

    @Column(name = "fec_nac_cli")
    private LocalDate fecNacCli;

    @Column(name = "img_cli")
    private String imgCli;

    @Column(name = "ci_cli")
    private String ciCli;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usu")
    private UsuarioEntity usuario;

    @Column(name = "cod_cli")
    private String codCli;

    @Column(name = "est_cli")
    private Boolean estCli;



    public ClienteEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomCli() { return nomCli; }
    public void setNomCli(String nomCli) { this.nomCli = nomCli; }
    public String getApPatCli() { return apPatCli; }
    public void setApPatCli(String apPatCli) { this.apPatCli = apPatCli; }
    public String getApMatCli() { return apMatCli; }
    public void setApMatCli(String apMatCli) { this.apMatCli = apMatCli; }
    public String getCelCli() { return celCli; }
    public void setCelCli(String celCli) { this.celCli = celCli; }
    public String getDirCli() { return dirCli; }
    public void setDirCli(String dirCli) { this.dirCli = dirCli; }
    public LocalDate getFecNacCli() { return fecNacCli; }
    public void setFecNacCli(LocalDate fecNacCli) { this.fecNacCli = fecNacCli; }
    public String getImgCli() { return imgCli; }
    public void setImgCli(String imgCli) { this.imgCli = imgCli; }
    public String getCiCli() { return ciCli; }
    public void setCiCli(String ciCli) { this.ciCli = ciCli; }
    public UsuarioEntity getUsuario() { return usuario; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }
    public String getCodCli() { return codCli; }
    public void setCodCli(String codCli) { this.codCli = codCli; }
    public Boolean getEstCli() { return estCli; }
    public void setEstCli(Boolean estCli) { this.estCli = estCli; }

}
