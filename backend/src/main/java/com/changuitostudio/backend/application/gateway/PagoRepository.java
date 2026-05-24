package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Pago;

import java.util.Map;
import java.util.Optional;

public interface PagoRepository {
    PageResult<Pago> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Pago> obtenerPorId(Long id);
    Pago guardar(Pago pago);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    boolean existsByCodigo(String codigo);
    Pago save(Pago pago);
}
