package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MaterialRepository;
import com.changuitostudio.backend.domain.model.Material;
import com.changuitostudio.backend.infrastructure.persistence.entity.MaterialEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.MaterialMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.MaterialJpaRepository;
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
public class MaterialJpaAdapter implements MaterialRepository {

    private final MaterialJpaRepository repository;

    public MaterialJpaAdapter(MaterialJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Material> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<MaterialEntity> entityPage = repository.findAll(MaterialSpecifications.byFilters(filters), pageable);

        List<Material> content = entityPage.getContent().stream()
                .map(MaterialMapper::toDomain)
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
    public Optional<Material> obtenerPorId(Long id) {
        return repository.findById(id).map(MaterialMapper::toDomain);
    }

    @Override
    public Material guardar(Material material) {
        MaterialEntity entity = MaterialMapper.toEntity(material);
        return MaterialMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Material> findById(Long id) {
        return obtenerPorId(id);
    }

    @Override
    public Material save(Material material) {
        return guardar(material);
    }
}
