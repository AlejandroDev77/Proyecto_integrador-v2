package com.changuitostudio.backend.application.gateway;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.domain.model.Mueble;

import java.util.Map;
import java.util.Optional;

public interface MuebleRepository {

    PageResult<Mueble> buscarTodos(int page, int size, Map<String, String> filters, String sort);

    Optional<Mueble> buscarPorId(Long id);

    Mueble guardar(Mueble mueble);

    void eliminarPorId(Long id);
}
