package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.RolRepository;
import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.infrastructure.persistence.entity.RolEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.RolMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.RolJpaRepository;

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
 * Adaptador de salida â€” Implementa el puerto RolRepository con JPA.
 */
@Component
public class RolJpaAdapter implements RolRepository {

    private final RolJpaRepository jpaRepository;
    private final RolMapper mapper;

    @PersistenceContext
    private EntityManager entityManager;

    public RolJpaAdapter(RolJpaRepository jpaRepository, RolMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public PageResult<Rol> buscarTodos(int page, int size, Map<String, String> filters, String sort) {
        Specification<RolEntity> spec = RolSpecifications.fromFilters(filters);
        Pageable pageable = buildPageable(page, size, sort);

        Page<RolEntity> resultado = jpaRepository.findAll(spec, pageable);

        return new PageResult<>(
                resultado.getContent().stream().map(mapper::toDomain).toList(),
                page,
                size,
                resultado.getTotalElements()
        );
    }

    @Override
    public Optional<Rol> buscarPorId(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    @Transactional
    public Rol guardar(Rol rol) {
        RolEntity entity = mapper.toEntity(rol);
        RolEntity saved = jpaRepository.saveAndFlush(entity);

        entityManager.detach(saved);
        saved = jpaRepository.findById(saved.getIdRol()).orElse(saved);

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

