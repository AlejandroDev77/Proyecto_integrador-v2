package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.MovimientoInventarioRepository;
import com.changuitostudio.backend.domain.model.MovimientoInventario;
import com.changuitostudio.backend.infrastructure.persistence.entity.MovimientoInventarioEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.MovimientoInventarioMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.MovimientoInventarioJpaRepository;
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
public class MovimientoInventarioJpaAdapter implements MovimientoInventarioRepository {

    private final MovimientoInventarioJpaRepository repository;

    public MovimientoInventarioJpaAdapter(MovimientoInventarioJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<MovimientoInventario> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<MovimientoInventarioEntity> entityPage = repository.findAll(MovimientoInventarioSpecifications.byFilters(filters), pageable);

        List<MovimientoInventario> content = entityPage.getContent().stream()
                .map(MovimientoInventarioMapper::toDomain)
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
    public Optional<MovimientoInventario> obtenerPorId(Long id) {
        return repository.findById(id).map(MovimientoInventarioMapper::toDomain);
    }

    @Override
    public MovimientoInventario guardar(MovimientoInventario movimientoinventario) {
        MovimientoInventarioEntity entity = MovimientoInventarioMapper.toEntity(movimientoinventario);
        return MovimientoInventarioMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodMov(codigo);
    }

    @Override
    public MovimientoInventario save(MovimientoInventario movimiento) {
        return guardar(movimiento);
    }
}
