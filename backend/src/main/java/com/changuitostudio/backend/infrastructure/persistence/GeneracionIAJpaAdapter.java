package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.GeneracionIARepository;
import com.changuitostudio.backend.domain.model.GeneracionIA;
import com.changuitostudio.backend.infrastructure.persistence.entity.GeneracionIAEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.GeneracionIAMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.JpaGeneracionIARepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Component
public class GeneracionIAJpaAdapter implements GeneracionIARepository {

    private final JpaGeneracionIARepository jpaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public GeneracionIAJpaAdapter(JpaGeneracionIARepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public PageResult<GeneracionIA> buscarTodos(int page, int size, Map<String, String> filters, String sort) {
        // Por ahora sin filtros complejos
        Pageable pageable = buildPageable(page, size, sort);
        Page<GeneracionIAEntity> resultado = jpaRepository.findAll(pageable);

        return new PageResult<>(
                resultado.getContent().stream().map(GeneracionIAMapper::toDomain).toList(),
                page,
                size,
                resultado.getTotalElements()
        );
    }

    @Override
    public Optional<GeneracionIA> buscarPorId(Long id) {
        return jpaRepository.findById(id).map(GeneracionIAMapper::toDomain);
    }

    @Override
    @Transactional
    public GeneracionIA guardar(GeneracionIA generacionIA) {
        GeneracionIAEntity entity = GeneracionIAMapper.toEntity(generacionIA);
        GeneracionIAEntity saved = jpaRepository.saveAndFlush(entity);

        entityManager.detach(saved);
        saved = jpaRepository.findById(saved.getIdGen()).orElse(saved);

        return GeneracionIAMapper.toDomain(saved);
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
