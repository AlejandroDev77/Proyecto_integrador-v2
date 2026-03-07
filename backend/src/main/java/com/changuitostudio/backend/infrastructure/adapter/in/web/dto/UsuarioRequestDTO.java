package com.changuitostudio.backend.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO de entrada para crear/actualizar un usuario.
 * Campos iguales a los que envía el frontend Laravel.
 */
public class UsuarioRequestDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio.")
    private String nom_usu;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El correo electrónico debe ser válido.")
    private String email_usu;

    @NotNull(message = "El estado es obligatorio.")
    private Boolean est_usu;

    @NotNull(message = "El rol es obligatorio.")
    private Long id_rol;

    public UsuarioRequestDTO() {
    }

    // ── Getters & Setters (campo con underscore para compatibilidad JSON) ──

    public String getNom_usu() {
        return nom_usu;
    }

    public void setNom_usu(String nom_usu) {
        this.nom_usu = nom_usu;
    }

    public String getEmail_usu() {
        return email_usu;
    }

    public void setEmail_usu(String email_usu) {
        this.email_usu = email_usu;
    }

    public Boolean getEst_usu() {
        return est_usu;
    }

    public void setEst_usu(Boolean est_usu) {
        this.est_usu = est_usu;
    }

    public Long getId_rol() {
        return id_rol;
    }

    public void setId_rol(Long id_rol) {
        this.id_rol = id_rol;
    }
}
