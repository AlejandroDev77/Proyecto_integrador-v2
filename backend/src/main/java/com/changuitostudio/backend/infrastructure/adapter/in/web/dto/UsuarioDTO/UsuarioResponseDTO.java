package com.changuitostudio.backend.infrastructure.adapter.in.web.dto.UsuarioDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para RESPONSE de Usuario
 * Se usa para devolver data de usuarios al cliente en formato.
 */
public class UsuarioResponseDTO {

    @JsonProperty("id_usu")
    private Long idUsu;

    @JsonProperty("nom_usu")
    private String nomUsu;

    @JsonProperty("email_usu")
    private String emailUsu;

    @JsonProperty("est_usu")
    private Boolean estUsu;

    @JsonProperty("cod_usu")
    private String codUsu;

    @JsonProperty("id_rol")
    private Long idRol;

    @JsonProperty("nom_rol")
    private String nomRol;

    public UsuarioResponseDTO() {
    }

    public UsuarioResponseDTO(Long idUsu, String nomUsu, String emailUsu, Boolean estUsu, 
                              String codUsu, Long idRol, String nomRol) {
        this.idUsu = idUsu;
        this.nomUsu = nomUsu;
        this.emailUsu = emailUsu;
        this.estUsu = estUsu;
        this.codUsu = codUsu;
        this.idRol = idRol;
        this.nomRol = nomRol;
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

    public String getNomRol() {
        return nomRol;
    }

    public void setNomRol(String nomRol) {
        this.nomRol = nomRol;
    }
}
