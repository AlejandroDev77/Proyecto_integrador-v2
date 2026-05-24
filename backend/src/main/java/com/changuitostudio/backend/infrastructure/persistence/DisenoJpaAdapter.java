package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DisenoRepository;
import com.changuitostudio.backend.domain.model.Diseno;
import com.changuitostudio.backend.infrastructure.persistence.entity.DisenoEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.DisenoMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.DisenoJpaRepository;
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
public class DisenoJpaAdapter implements DisenoRepository {

    private final DisenoJpaRepository repository;

    public DisenoJpaAdapter(DisenoJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Diseno> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<DisenoEntity> entityPage = repository.findAll(DisenoSpecifications.byFilters(filters), pageable);

        List<Diseno> content = entityPage.getContent().stream()
                .map(DisenoMapper::toDomain)
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
    public Optional<Diseno> obtenerPorId(Long id) {
        return repository.findById(id).map(DisenoMapper::toDomain);
    }

    @Override
    public Diseno guardar(Diseno diseno) {
        DisenoEntity entity = DisenoMapper.toEntity(diseno);
        return DisenoMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
