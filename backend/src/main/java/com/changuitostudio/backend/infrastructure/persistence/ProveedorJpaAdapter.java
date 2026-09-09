package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ProveedorRepository;
import com.changuitostudio.backend.domain.model.Proveedor;
import com.changuitostudio.backend.infrastructure.persistence.entity.ProveedorEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.ProveedorMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.ProveedorJpaRepository;
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
public class ProveedorJpaAdapter implements ProveedorRepository {

    private final ProveedorJpaRepository repository;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    public ProveedorJpaAdapter(ProveedorJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Proveedor> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<ProveedorEntity> entityPage = repository.findAll(ProveedorSpecifications.byFilters(filters), pageable);

        List<Proveedor> content = entityPage.getContent().stream()
                .map(ProveedorMapper::toDomain)
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
    public Optional<Proveedor> obtenerPorId(Long id) {
        return repository.findById(id).map(ProveedorMapper::toDomain);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Proveedor guardar(Proveedor proveedor) {
        ProveedorEntity entity = ProveedorMapper.toEntity(proveedor);
        ProveedorEntity saved = repository.saveAndFlush(entity);
        entityManager.refresh(saved);
        return ProveedorMapper.toDomain(saved);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Proveedor> findById(Long id) {
        return obtenerPorId(id);
    }
}
