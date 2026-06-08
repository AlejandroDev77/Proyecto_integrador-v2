package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_case")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suite_id", nullable = false)
    private TestSuiteEntity suite;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String gherkin;

    @Column
    private Integer orden;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn;

    @Column(length = 100)
    private String autor;

    @Column(name = "caso_uso", columnDefinition = "TEXT")
    private String casoUso;

    @Column(length = 100)
    private String modulo;

    @Column(name = "version_sistema", length = 20)
    private String versionSistema;

    @Column(name = "datos_requeridos", columnDefinition = "TEXT")
    private String datosRequeridos;

    @Column(columnDefinition = "TEXT")
    private String prerequisitos;

    @Column(columnDefinition = "TEXT")
    private String postcondiciones;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @PrePersist
    public void prePersist() {
        this.creadoEn = LocalDateTime.now();
        if (this.orden == null)
            this.orden = 0;
    }

}