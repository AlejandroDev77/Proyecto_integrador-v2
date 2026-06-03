package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_step_result")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TestStepResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "execution_id", nullable = false)
    private TestExecutionEntity execution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private TestCaseEntity testCase;

    @Column(nullable = false)
    private Integer paso;

    @Column(name = "entrada_accion", columnDefinition = "TEXT")
    private String entradaAccion;

    @Column(name = "resultado_esperado", columnDefinition = "TEXT")
    private String resultadoEsperado;

    @Column(name = "resultado_obtenido", columnDefinition = "TEXT")
    private String resultadoObtenido;

    @Column(columnDefinition = "TEXT")
    private String defectos;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(length = 10)
    private String estado; // PASA | FALLA

    @Column(name = "screenshot_path")
    private String screenshotPath;

    @Column(name = "tiempo_ms")
    private Integer tiempoMs;

    @Column(name = "ejecutado_en")
    private LocalDateTime ejecutadoEn;

    @PrePersist
    public void prePersist() {
        this.ejecutadoEn = LocalDateTime.now();
    }
}