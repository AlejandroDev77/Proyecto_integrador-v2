package com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;

/**
 * Entidad JPA — Mapea a la tabla 'usuarios' en PostgreSQL.
 */
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

    @Column(name = "id_rol", insertable = false, updatable = false)
    private Long idRol;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol")
    private RolEntity rol;

    public UsuarioEntity() {
    }

    // ── Getters & Setters ──────────────────────────────────────

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
