package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Venta;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

public interface VentaRepository {
    // Métodos CRUD básicos
    PageResult<Venta> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Venta> obtenerPorId(Long id);
    Venta guardar(Venta venta);
    void eliminar(Long id);
    
    // Métodos para módulo de negocio
    Optional<Venta> findById(Long id);
    Venta save(Venta venta);
    boolean existsByCodigo(String codigo);
    long countByFecVen(LocalDate fecha);
}
