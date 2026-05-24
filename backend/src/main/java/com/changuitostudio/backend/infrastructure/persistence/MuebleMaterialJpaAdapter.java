package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MuebleMaterialRepository;
import com.changuitostudio.backend.domain.model.MuebleMaterial;
import com.changuitostudio.backend.infrastructure.persistence.entity.MuebleMaterialEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.MuebleMaterialMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.MuebleMaterialJpaRepository;
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
public class MuebleMaterialJpaAdapter implements MuebleMaterialRepository {

    private final MuebleMaterialJpaRepository repository;

    public MuebleMaterialJpaAdapter(MuebleMaterialJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<MuebleMaterial> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<MuebleMaterialEntity> entityPage = repository.findAll(MuebleMaterialSpecifications.byFilters(filters), pageable);

        List<MuebleMaterial> content = entityPage.getContent().stream()
                .map(MuebleMaterialMapper::toDomain)
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
    public Optional<MuebleMaterial> obtenerPorId(Long id) {
        return repository.findById(id).map(MuebleMaterialMapper::toDomain);
    }

    @Override
    public MuebleMaterial guardar(MuebleMaterial mueblematerial) {
        MuebleMaterialEntity entity = MuebleMaterialMapper.toEntity(mueblematerial);
        return MuebleMaterialMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
