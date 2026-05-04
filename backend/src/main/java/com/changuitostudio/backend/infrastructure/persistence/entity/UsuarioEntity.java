package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "usuarios")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usu")
    private Long idUsu;

    @Column(name = "nom_usu", nullable = false, length = 100)
    private String nomUsu;

    @Column(name = "email_usu", nullable = false, unique = true, length = 200)
    private String emailUsu;

    @Column(name = "pas_usu", nullable = false)
    private String pasUsu;

    @Column(name = "est_usu", nullable = false)
    private Boolean estUsu;

    @Column(name = "cod_usu", length = 50)
    private String codUsu;

    @Column(name = "secret_2fa")
    private String secret2fa;

    @Column(name = "is_2fa_enabled")
    private Boolean is2faEnabled;

    @Column(name = "id_rol", insertable = false, updatable = false)
    private Long idRol;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol")
    private RolEntity rol;

    public UsuarioEntity() {
    }

   
    public Long getIdUsu() {
        return idUsu;
    }

    public void setIdUsu(Long idUsu) {
        this.idUsu = idUsu;
    }

    public String getNomUsu() {
        return nomUsu;
    }

    public void setNomUsu(String nomUsu) {
        this.nomUsu = nomUsu;
    }

    public String getEmailUsu() {
        return emailUsu;
    }

    public void setEmailUsu(String emailUsu) {
        this.emailUsu = emailUsu;
    }

    public String getPasUsu() {
        return pasUsu;
    }

    public void setPasUsu(String pasUsu) {
        this.pasUsu = pasUsu;
    }

    public Boolean getEstUsu() {
        return estUsu;
    }

    public void setEstUsu(Boolean estUsu) {
        this.estUsu = estUsu;
    }

    public String getCodUsu() {
        return codUsu;
    }

    public void setCodUsu(String codUsu) {
        this.codUsu = codUsu;
    }

    public String getSecret2fa() {
        return secret2fa;
    }

    public void setSecret2fa(String secret2fa) {
        this.secret2fa = secret2fa;
    }

    public Boolean getIs2faEnabled() {
        return is2faEnabled;
    }

    public void setIs2faEnabled(Boolean is2faEnabled) {
        this.is2faEnabled = is2faEnabled;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public RolEntity getRol() {
        return rol;
    }

    public void setRol(RolEntity rol) {
        this.rol = rol;
    }
}

