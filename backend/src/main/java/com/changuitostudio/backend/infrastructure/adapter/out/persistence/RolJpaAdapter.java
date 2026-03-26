package com.changuitostudio.backend.infrastructure.adapter.out.persistence;

import com.changuitostudio.backend.application.port.out.RolPersistencePort;
import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.RolEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.mapper.RolMapper;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.RolJpaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

// Adaptador de SALIDA - Implementa el puerto de persistencia RolPersistencePort con JPA
@Component
public class RolJpaAdapter implements RolPersistencePort {

    private final RolJpaRepository jpaRepository;
    private final RolMapper mapper;

    @PersistenceContext
    private EntityManager entityManager;

    public RolJpaAdapter(RolJpaRepository jpaRepository, RolMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    // Buscar todos con filtros y paginación
    @Override
    public Page<Rol> buscarTodos(Specification<RolEntity> spec, Pageable pageable) {
        return jpaRepository.findAll(spec, pageable)
                .map(mapper::toDomain);
    }

    // Buscar por ID con relaciones cargadas
    @Override
    public Optional<Rol> buscarPorId(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    // Guardar nuevo Rol o actualizar existente
    @Override
    @Transactional
    public Rol guardar(Rol rol) {
        RolEntity entity = mapper.toEntity(rol);
        RolEntity saved = jpaRepository.saveAndFlush(entity);

        // Limpiar cache para forzar recarga con relaciones
        entityManager.detach(saved);
        saved = jpaRepository.findById(saved.getIdRol()).orElse(saved);

        return mapper.toDomain(saved);
    }

    // Eliminar por ID
    @Override
    public void eliminarPorId(Long id) {
        jpaRepository.deleteById(id);
    }
}
