package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.PermisoRepository;
import com.changuitostudio.backend.domain.model.Permiso;
import com.changuitostudio.backend.infrastructure.persistence.entity.PermisoEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.PermisoMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.PermisoJpaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

/**
 * ✅ Adaptador de salida – Implementa el puerto PermisoRepository con JPA.
 */
@Component
public class PermisoJpaAdapter implements PermisoRepository {

    private final PermisoJpaRepository jpaRepository;
    private final PermisoMapper mapper;

    @PersistenceContext
    private EntityManager entityManager;

    public PermisoJpaAdapter(PermisoJpaRepository jpaRepository, PermisoMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public PageResult<Permiso> buscarTodos(int page, int size, Map<String, String> filters, String sort) {
        Specification<PermisoEntity> spec = PermisoSpecifications.fromFilters(filters);
        Pageable pageable = buildPageable(page, size, sort);

        Page<PermisoEntity> resultado = jpaRepository.findAll(spec, pageable);

        return new PageResult<>(
                resultado.getContent().stream().map(mapper::toDomain).toList(),
                page,
                size,
                resultado.getTotalElements()
        );
    }

    @Override
    public Optional<Permiso> buscarPorId(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    @Transactional
    public Permiso guardar(Permiso permiso) {
        PermisoEntity entity = mapper.toEntity(permiso);
        PermisoEntity saved = jpaRepository.saveAndFlush(entity);

        entityManager.detach(saved);
        saved = jpaRepository.findById(saved.getIdPermiso()).orElse(saved);

        return mapper.toDomain(saved);
    }

    @Override
    public void eliminarPorId(Long id) {
        jpaRepository.deleteById(id);
    }

    private Pageable buildPageable(int page, int size, String sort) {
        if (sort != null && !sort.isBlank()) {
            String[] sortParts = sort.contains(":") ? sort.split(":") : new String[]{sort, "asc"};
            if (sortParts.length == 2) {
                Sort.Direction direction = sortParts[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
                return PageRequest.of(page - 1, size, Sort.by(direction, sortParts[0]));
            }
        }
        return PageRequest.of(page - 1, size);
    }
}
