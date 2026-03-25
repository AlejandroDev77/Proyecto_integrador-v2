package com.changuitostudio.backend.application.port.out;

import com.changuitostudio.backend.domain.model.Rol;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;

import java.util.Optional;

// ✅ SOLUCIÓN: Debe ser 'interface', no 'class'
// Puerto de salida - Define el contrato de persistencia (el data layer)
public interface RolPersistencePort {

    // ✅ NOTA: En interfaces, los métodos NO requieren ser "implementados"
    // Son contratos que las clases concretas deben implementar
    Page<Rol> buscarTodos(Specification<RolEntity> spec, Pageable pageable);

    Optional<Rol> buscarPorId(Long id);

    Rol guardar(Rol rol);

    void eliminarPorId(Long id);
}    

