package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.ProduccionEtapa;

import java.util.Map;
import java.util.Optional;

public interface ManageProduccionEtapaUseCase {
    PageResult<ProduccionEtapa> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<ProduccionEtapa> obtenerPorId(Long id);
    ProduccionEtapa crear(ProduccionEtapa produccionetapa);
    ProduccionEtapa actualizar(Long id, ProduccionEtapa produccionetapa);
    void eliminar(Long id);
}
