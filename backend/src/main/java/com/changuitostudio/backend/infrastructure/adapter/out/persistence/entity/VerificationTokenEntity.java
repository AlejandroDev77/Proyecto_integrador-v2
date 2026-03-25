package com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
public class VerificationTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "id_usu")
    private UsuarioEntity usuario;

    @Column(nullable = false, name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(nullable = false, name = "token_type", length = 30)
    private String tokenType; // "PASSWORD_RESET" or "EMAIL_VERIFICATION"

    public VerificationTokenEntity() {
    }

    public VerificationTokenEntity(String token, UsuarioEntity usuario, LocalDateTime expiryDate, String tokenType) {
        this.token = token;
        this.usuario = usuario;
        this.expiryDate = expiryDate;
        this.tokenType = tokenType;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    // Verificar si está expirado
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}
