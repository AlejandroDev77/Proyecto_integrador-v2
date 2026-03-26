package com.changuitostudio.backend.infrastructure.adapter.in.web.dto.RolDTO;

import com.fasterxml.jackson.annotation.JsonProperty;;

public class RolResponseDTO {

    @JsonProperty("id_rol")

    private long idRol;

    @JsonProperty("nom_rol")
    private String nomRol;


    public RolResponseDTO() {
    }

    public RolResponseDTO(long idRol, String nomRol) {
        this.idRol = idRol;
        this.nomRol = nomRol;
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
