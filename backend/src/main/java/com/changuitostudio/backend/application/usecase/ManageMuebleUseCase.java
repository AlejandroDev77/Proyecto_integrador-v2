package com.changuitostudio.backend.application.usecase;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Mueble;

import java.util.Map;
import java.util.Optional;

public interface ManageMuebleUseCase {

    PageResult<Mueble> listarMuebles(int page, int perPage, Map<String, String> filters, String sort);

    Optional<Mueble> obtenerPorId(Long id);

    Mueble crear(Mueble mueble);

    Mueble actualizar(Long id, Mueble mueble);

    void eliminar(Long id);
}
