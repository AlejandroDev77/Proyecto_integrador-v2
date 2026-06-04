package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleDevolucionRepository;
import com.changuitostudio.backend.domain.model.DetalleDevolucion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleDevolucionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.DetalleDevolucionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.DetalleDevolucionJpaRepository;
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
public class DetalleDevolucionJpaAdapter implements DetalleDevolucionRepository {

    private final DetalleDevolucionJpaRepository repository;

    public DetalleDevolucionJpaAdapter(DetalleDevolucionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleDevolucion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<DetalleDevolucionEntity> entityPage = repository.findAll(DetalleDevolucionSpecifications.byFilters(filters), pageable);

        List<DetalleDevolucion> content = entityPage.getContent().stream()
                .map(DetalleDevolucionMapper::toDomain)
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
    public Optional<DetalleDevolucion> obtenerPorId(Long id) {
        return repository.findById(id).map(DetalleDevolucionMapper::toDomain);
    }

    @Override
    public DetalleDevolucion guardar(DetalleDevolucion detalledevolucion) {
        DetalleDevolucionEntity entity = DetalleDevolucionMapper.toEntity(detalledevolucion);
        return DetalleDevolucionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodDetDev(codigo);
    }

    @Override
    public DetalleDevolucion save(DetalleDevolucion detalleDevolucion) {
        return guardar(detalleDevolucion);
    }
}
