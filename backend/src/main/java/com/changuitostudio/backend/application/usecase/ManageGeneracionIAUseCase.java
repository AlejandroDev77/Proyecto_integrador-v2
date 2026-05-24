package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.GeneracionIA;

import java.util.Map;
import java.util.Optional;

public interface ManageGeneracionIAUseCase {

    PageResult<GeneracionIA> listar(int page, int perPage, Map<String, String> filters, String sort);

    Optional<GeneracionIA> obtenerPorId(Long id);

    GeneracionIA crear(GeneracionIA generacionIA);

    GeneracionIA actualizar(Long id, GeneracionIA generacionIA);

    void eliminar(Long id);
}
