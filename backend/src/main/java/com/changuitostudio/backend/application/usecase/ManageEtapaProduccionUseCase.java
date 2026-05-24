package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.EtapaProduccion;

import java.util.Map;
import java.util.Optional;

public interface ManageEtapaProduccionUseCase {
    PageResult<EtapaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<EtapaProduccion> obtenerPorId(Long id);
    EtapaProduccion crear(EtapaProduccion etapaproduccion);
    EtapaProduccion actualizar(Long id, EtapaProduccion etapaproduccion);
    void eliminar(Long id);
}
