package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Diseno;

import java.util.Map;
import java.util.Optional;

public interface DisenoRepository {
    PageResult<Diseno> listar(int page, int perPage, Map<String, String> filters, String sort);
    Optional<Diseno> obtenerPorId(Long id);
    Diseno guardar(Diseno diseno);
    void eliminar(Long id);
}
