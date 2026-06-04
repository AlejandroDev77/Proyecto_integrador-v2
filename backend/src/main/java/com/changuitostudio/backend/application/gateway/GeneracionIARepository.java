package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.GeneracionIA;

import java.util.Map;
import java.util.Optional;

public interface GeneracionIARepository {

    PageResult<GeneracionIA> buscarTodos(int page, int size, Map<String, String> filters, String sort);

    Optional<GeneracionIA> buscarPorId(Long id);

    GeneracionIA guardar(GeneracionIA generacionIA);

    void eliminarPorId(Long id);
}
