package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ProduccionRepository;
import com.changuitostudio.backend.domain.model.Produccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.ProduccionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.ProduccionJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProduccionJpaAdapter implements ProduccionRepository {

    private final ProduccionJpaRepository repository;

    public ProduccionJpaAdapter(ProduccionJpaRepository repository) {
        this.repository = repository;
    }

    /**
     * Converts snake_case to camelCase for JPA property mapping.
     */
    private String snakeToCamel(String snake) {
        if (snake == null || !snake.contains("_")) return snake;
        StringBuilder sb = new StringBuilder();
        boolean upper = false;
        for (char c : snake.toCharArray()) {
            if (c == '_') { upper = true; }
            else { sb.append(upper ? Character.toUpperCase(c) : c); upper = false; }
        }
        return sb.toString();
    }

    @Override
    public PageResult<Produccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<ProduccionEntity> entityPage = repository.findAll(ProduccionSpecifications.byFilters(filters), pageable);

        List<Produccion> content = entityPage.getContent().stream()
                .map(ProduccionMapper::toDomain)
                .collect(Collectors.toList());

        return new PageResult<>(
                content,
                entityPage.getTotalElements(),
                entityPage.getNumber() + 1,
                entityPage.getTotalPages(),
                entityPage.getSize()
        );
    }

    @Override
    public Optional<Produccion> obtenerPorId(Long id) {
        return repository.findById(id).map(ProduccionMapper::toDomain);
    }

    @Override
    public Produccion guardar(Produccion produccion) {
        ProduccionEntity entity = ProduccionMapper.toEntity(produccion);
        return ProduccionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // ✨ Métodos para módulo de negocio

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodPro(codigo);
    }

    @Override
    public Produccion save(Produccion produccion) {
        return guardar(produccion);
    }
}
