package com.changuitostudio.backend.infrastructure.controller.dto.UsuarioDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para REQUEST de Usuario
 * Se usa para crear y actualizar usuarios
 */
public class UsuarioRequestDTO {

    @NotBlank(message = "El nombre usuario no puede estar vacio")
    @JsonProperty("nom_usu")
    private String nomUsu;

    @NotBlank(message = "El email no puede estar vacio")
    @Email(message = "El email debe ser valido")
    @JsonProperty("email_usu")
    private String emailUsu;

    @JsonProperty("pas_usu")
    private String pasUsu;

    @NotNull(message = "El ID del rol no puede estar vacio")
    @JsonProperty("id_rol")
    private Long idRol;

    @JsonProperty("est_usu")
    private Boolean estUsu;

    @JsonProperty("cod_usu")
    private String codUsu;

    public UsuarioRequestDTO() {
    }

    public UsuarioRequestDTO(String nomUsu, String emailUsu, String pasUsu, Long idRol, Boolean estUsu, String codUsu) {
        this.nomUsu = nomUsu;
        this.emailUsu = emailUsu;
        this.pasUsu = pasUsu;
        this.idRol = idRol;
        this.estUsu = estUsu;
        this.codUsu = codUsu;
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

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
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
}

