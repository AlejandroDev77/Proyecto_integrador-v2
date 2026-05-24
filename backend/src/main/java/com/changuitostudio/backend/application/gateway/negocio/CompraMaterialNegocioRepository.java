package com.changuitostudio.backend.application.gateway.negocio;

import com.changuitostudio.backend.domain.model.CompraMaterial;

/**
 * Repository interface for business operations related to CompraMaterial
 */
public interface CompraMaterialNegocioRepository {
    CompraMaterial save(CompraMaterial compra);
    boolean existsByCodigo(String codigo);
    long countByFecCompMonth(int month, int year);
}
