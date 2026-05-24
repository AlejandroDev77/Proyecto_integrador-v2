package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "proveedores")
public class ProveedorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prov")
    private Long id;

    @Column(name = "nom_prov")
    private String nomProv;

    @Column(name = "contacto_prov")
    private String contactoProv;

    @Column(name = "tel_prov")
    private String telProv;

    @Column(name = "email_prov")
    private String emailProv;

    @Column(name = "dir_prov")
    private String dirProv;

    @Column(name = "nit_prov")
    private String nitProv;

    @Column(name = "est_prov")
    private Boolean estProv;

    @Column(name = "cod_prov")
    private String codProv;



    public ProveedorEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomProv() { return nomProv; }
    public void setNomProv(String nomProv) { this.nomProv = nomProv; }
    public String getContactoProv() { return contactoProv; }
    public void setContactoProv(String contactoProv) { this.contactoProv = contactoProv; }
    public String getTelProv() { return telProv; }
    public void setTelProv(String telProv) { this.telProv = telProv; }
    public String getEmailProv() { return emailProv; }
    public void setEmailProv(String emailProv) { this.emailProv = emailProv; }
    public String getDirProv() { return dirProv; }
    public void setDirProv(String dirProv) { this.dirProv = dirProv; }
    public String getNitProv() { return nitProv; }
    public void setNitProv(String nitProv) { this.nitProv = nitProv; }
    public Boolean getEstProv() { return estProv; }
    public void setEstProv(Boolean estProv) { this.estProv = estProv; }
    public String getCodProv() { return codProv; }
    public void setCodProv(String codProv) { this.codProv = codProv; }

}
