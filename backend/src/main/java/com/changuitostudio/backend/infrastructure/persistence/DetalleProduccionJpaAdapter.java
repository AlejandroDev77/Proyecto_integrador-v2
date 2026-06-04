package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleProduccionRepository;
import com.changuitostudio.backend.domain.model.DetalleProduccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleProduccionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.DetalleProduccionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.DetalleProduccionJpaRepository;
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
public class DetalleProduccionJpaAdapter implements DetalleProduccionRepository {

    private final DetalleProduccionJpaRepository repository;

    public DetalleProduccionJpaAdapter(DetalleProduccionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleProduccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<DetalleProduccionEntity> entityPage = repository.findAll(DetalleProduccionSpecifications.byFilters(filters), pageable);

        List<DetalleProduccion> content = entityPage.getContent().stream()
                .map(DetalleProduccionMapper::toDomain)
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
    public Optional<DetalleProduccion> obtenerPorId(Long id) {
        return repository.findById(id).map(DetalleProduccionMapper::toDomain);
    }

    @Override
    public DetalleProduccion guardar(DetalleProduccion detalleproduccion) {
        DetalleProduccionEntity entity = DetalleProduccionMapper.toEntity(detalleproduccion);
        return DetalleProduccionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodDetPro(codigo);
    }

    @Override
    public DetalleProduccion save(DetalleProduccion detalleProduccion) {
        return guardar(detalleProduccion);
    }
}
