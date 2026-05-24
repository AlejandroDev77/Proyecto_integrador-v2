package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleVentaRepository;
import com.changuitostudio.backend.domain.model.DetalleVenta;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleVentaEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.DetalleVentaMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.DetalleVentaJpaRepository;
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
public class DetalleVentaJpaAdapter implements DetalleVentaRepository {

    private final DetalleVentaJpaRepository repository;

    public DetalleVentaJpaAdapter(DetalleVentaJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleVenta> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<DetalleVentaEntity> entityPage = repository.findAll(DetalleVentaSpecifications.byFilters(filters), pageable);

        List<DetalleVenta> content = entityPage.getContent().stream()
                .map(DetalleVentaMapper::toDomain)
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
    public Optional<DetalleVenta> obtenerPorId(Long id) {
        return repository.findById(id).map(DetalleVentaMapper::toDomain);
    }

    @Override
    public DetalleVenta guardar(DetalleVenta detalleventa) {
        DetalleVentaEntity entity = DetalleVentaMapper.toEntity(detalleventa);
        return DetalleVentaMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodDetVen(codigo);
    }

    @Override
    public DetalleVenta save(DetalleVenta detalleVenta) {
        return guardar(detalleVenta);
    }
}
