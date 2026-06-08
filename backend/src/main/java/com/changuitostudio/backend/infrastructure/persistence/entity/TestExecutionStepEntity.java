package com.changuitostudio.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_execution_step")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TestExecutionStepEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "execution_id", nullable = false)
    private TestExecutionEntity execution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private TestCaseEntity testCase;

    @Column(name = "resultado_esperado", columnDefinition = "TEXT")
    private String resultadoEsperado;

    @Column(name = "resultado_obtenido", columnDefinition = "TEXT")
    private String resultadoObtenido;

    @Column(length = 20)
    private String estado; // pass | fail | pendiente

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "screenshot_path")
    private String screenshotPath;

    @Column(name = "tiempo_ms")
    private Integer tiempoMs;

    @Column(name = "ejecutado_en")
    private LocalDateTime ejecutadoEn;

    @PrePersist
    public void prePersist() {
        this.ejecutadoEn = LocalDateTime.now();
        if (this.estado == null) this.estado = "pendiente";
    }
}