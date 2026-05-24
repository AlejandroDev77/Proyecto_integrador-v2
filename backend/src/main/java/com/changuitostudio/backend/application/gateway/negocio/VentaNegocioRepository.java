package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.Venta;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Repository interface for business operations related to Venta
 */
public interface VentaNegocioRepository {
    Optional<Venta> findById(Long id);
    Venta save(Venta venta);
    boolean existsByCodigo(String codigo);
    long countByFecVen(LocalDate fecha);
}
