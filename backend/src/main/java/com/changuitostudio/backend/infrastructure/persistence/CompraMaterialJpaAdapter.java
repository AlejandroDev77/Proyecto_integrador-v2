package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CompraMaterialRepository;
import com.changuitostudio.backend.domain.model.CompraMaterial;
import com.changuitostudio.backend.infrastructure.persistence.entity.CompraMaterialEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.CompraMaterialMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.CompraMaterialJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CompraMaterialJpaAdapter implements CompraMaterialRepository {

    private final CompraMaterialJpaRepository repository;

    public CompraMaterialJpaAdapter(CompraMaterialJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<CompraMaterial> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<CompraMaterialEntity> entityPage = repository.findAll(CompraMaterialSpecifications.byFilters(filters), pageable);

        List<CompraMaterial> content = entityPage.getContent().stream()
                .map(CompraMaterialMapper::toDomain)
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
    public Optional<CompraMaterial> obtenerPorId(Long id) {
        return repository.findById(id).map(CompraMaterialMapper::toDomain);
    }

    @Override
    public CompraMaterial guardar(CompraMaterial compramaterial) {
        CompraMaterialEntity entity = CompraMaterialMapper.toEntity(compramaterial);
        return CompraMaterialMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodComp(codigo);
    }

    @Override
    public long countByFecCompMonth(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return repository.countByFecCompBetween(start, end);
    }

    @Override
    public CompraMaterial save(CompraMaterial compraMaterial) {
        return guardar(compraMaterial);
    }
}
