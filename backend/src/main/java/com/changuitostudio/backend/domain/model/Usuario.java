package com.changuitostudio.backend.domain.model;

public class Usuario {

    private Long idUsu;
    private String nomUsu;
    private String emailUsu;
    private String pasUsu;
    private Boolean estUsu;
    private String codUsu;
    private Long idRol;
    private String secret2fa;
    private Boolean is2faEnabled;

    // Datos del rol
    private String nomRol;

    public Usuario() {
    }

    public Usuario(Long idUsu, String nomUsu, String emailUsu, String pasUsu,
            Boolean estUsu, String codUsu, Long idRol, String nomRol, String secret2fa, Boolean is2faEnabled) {
        this.idUsu = idUsu;
        this.nomUsu = nomUsu;
        this.emailUsu = emailUsu;
        this.pasUsu = pasUsu;
        this.estUsu = estUsu;
        this.codUsu = codUsu;
        this.idRol = idRol;
        this.nomRol = nomRol;
        this.secret2fa = secret2fa;
        this.is2faEnabled = is2faEnabled;
    }

    // Captadores y Colocadores

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

    // Captadores y Colocadores de 2FA

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

    public String getNomRol() {
        return nomRol;
    }

    public void setNomRol(String nomRol) {
        this.nomRol = nomRol;
    }
}
