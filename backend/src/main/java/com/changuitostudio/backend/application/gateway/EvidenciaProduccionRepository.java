package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.EvidenciaProduccion;

import java.util.Map;
import java.util.Optional;

public interface EvidenciaProduccionRepository {
    PageResult<EvidenciaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<EvidenciaProduccion> obtenerPorId(Long id);
    EvidenciaProduccion guardar(EvidenciaProduccion evidenciaproduccion);
    boolean existsByCodigo(String codigo);
    void eliminar(Long id);
}
