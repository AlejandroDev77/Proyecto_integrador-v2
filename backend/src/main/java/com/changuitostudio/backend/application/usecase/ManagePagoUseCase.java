package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Pago;

import java.util.Map;
import java.util.Optional;

public interface ManagePagoUseCase {
    PageResult<Pago> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Pago> obtenerPorId(Long id);
    Pago crear(Pago pago);
    Pago actualizar(Long id, Pago pago);
    void eliminar(Long id);
}
