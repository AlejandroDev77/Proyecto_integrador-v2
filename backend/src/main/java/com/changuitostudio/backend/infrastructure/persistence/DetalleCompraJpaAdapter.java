package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleCompraRepository;
import com.changuitostudio.backend.domain.model.DetalleCompra;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCompraEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.DetalleCompraMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.DetalleCompraJpaRepository;
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
public class DetalleCompraJpaAdapter implements DetalleCompraRepository {

    private final DetalleCompraJpaRepository repository;

    public DetalleCompraJpaAdapter(DetalleCompraJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleCompra> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<DetalleCompraEntity> entityPage = repository.findAll(DetalleCompraSpecifications.byFilters(filters), pageable);

        List<DetalleCompra> content = entityPage.getContent().stream()
                .map(DetalleCompraMapper::toDomain)
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
    public Optional<DetalleCompra> obtenerPorId(Long id) {
        return repository.findById(id).map(DetalleCompraMapper::toDomain);
    }

    @Override
    public DetalleCompra guardar(DetalleCompra detallecompra) {
        DetalleCompraEntity entity = DetalleCompraMapper.toEntity(detallecompra);
        return DetalleCompraMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodDetComp(codigo);
    }

    @Override
    public DetalleCompra save(DetalleCompra detalleCompra) {
        return guardar(detalleCompra);
    }
}
