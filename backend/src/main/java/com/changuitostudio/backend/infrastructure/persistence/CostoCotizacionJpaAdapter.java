package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CostoCotizacionRepository;
import com.changuitostudio.backend.domain.model.CostoCotizacion;
import com.changuitostudio.backend.infrastructure.persistence.entity.CostoCotizacionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.CostoCotizacionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.CostoCotizacionJpaRepository;
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
public class CostoCotizacionJpaAdapter implements CostoCotizacionRepository {

    private final CostoCotizacionJpaRepository repository;

    public CostoCotizacionJpaAdapter(CostoCotizacionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<CostoCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<CostoCotizacionEntity> entityPage = repository.findAll(CostoCotizacionSpecifications.byFilters(filters), pageable);

        List<CostoCotizacion> content = entityPage.getContent().stream()
                .map(CostoCotizacionMapper::toDomain)
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
    public Optional<CostoCotizacion> obtenerPorId(Long id) {
        return repository.findById(id).map(CostoCotizacionMapper::toDomain);
    }

    @Override
    public CostoCotizacion guardar(CostoCotizacion costocotizacion) {
        CostoCotizacionEntity entity = CostoCotizacionMapper.toEntity(costocotizacion);
        return CostoCotizacionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public CostoCotizacion save(CostoCotizacion costoCotizacion) {
        return guardar(costoCotizacion);
    }
}
