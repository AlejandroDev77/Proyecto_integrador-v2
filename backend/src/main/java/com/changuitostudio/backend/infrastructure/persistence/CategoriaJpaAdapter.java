package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CategoriaRepository;
import com.changuitostudio.backend.domain.model.Categoria;
import com.changuitostudio.backend.infrastructure.persistence.entity.CategoriaEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.CategoriaMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.CategoriaJpaRepository;
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


@Component
public class CategoriaJpaAdapter implements CategoriaRepository {

    private final CategoriaJpaRepository jpaRepository;
    private final CategoriaMapper mapper;

    @PersistenceContext
    private EntityManager entityManager;

    public CategoriaJpaAdapter(CategoriaJpaRepository jpaRepository, CategoriaMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public PageResult<Categoria> buscarTodos(int page, int size, Map<String, String> filters, String sort) {
        Specification<CategoriaEntity> spec = CategoriaSpecifications.fromFilters(filters);
        Pageable pageable = buildPageable(page, size, sort);

        Page<CategoriaEntity> resultado = jpaRepository.findAll(spec, pageable);

        return new PageResult<>(
                resultado.getContent().stream().map(mapper::toDomain).toList(),
                page,
                size,
                resultado.getTotalElements()
        );
    }

    @Override
    public Optional<Categoria> buscarPorId(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    @Transactional
    public Categoria guardar(Categoria categoria) {
        CategoriaEntity entity = mapper.toEntity(categoria);
        CategoriaEntity saved = jpaRepository.saveAndFlush(entity);

        entityManager.detach(saved);
        saved = jpaRepository.findById(saved.getIdCat()).orElse(saved);

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
