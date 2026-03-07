package com.changuitostudio.backend.application.port.out;

import com.changuitostudio.backend.domain.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;

import java.util.Optional;

/**
 * Puerto de SALIDA — Define qué necesita el caso de uso de la persistencia.
 */
public interface UsuarioPersistencePort {

    Page<Usuario> buscarTodos(Specification<UsuarioEntity> spec, Pageable pageable);

    Optional<Usuario> buscarPorId(Long id);

    Usuario guardar(Usuario usuario);

    void eliminarPorId(Long id);

    String generarCodigoUnico();
}
