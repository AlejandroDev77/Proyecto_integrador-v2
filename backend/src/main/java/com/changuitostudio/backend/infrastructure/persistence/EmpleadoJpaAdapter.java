package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.EmpleadoRepository;
import com.changuitostudio.backend.domain.model.Empleado;
import com.changuitostudio.backend.infrastructure.persistence.entity.EmpleadoEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.EmpleadoMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.EmpleadoJpaRepository;
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
public class EmpleadoJpaAdapter implements EmpleadoRepository {

    private final EmpleadoJpaRepository repository;

    public EmpleadoJpaAdapter(EmpleadoJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Empleado> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<EmpleadoEntity> entityPage = repository.findAll(EmpleadoSpecifications.byFilters(filters), pageable);

        List<Empleado> content = entityPage.getContent().stream()
                .map(EmpleadoMapper::toDomain)
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
    public Optional<Empleado> obtenerPorId(Long id) {
        return repository.findById(id).map(EmpleadoMapper::toDomain);
    }

    @Override
    public Empleado guardar(Empleado empleado) {
        EmpleadoEntity entity = EmpleadoMapper.toEntity(empleado);
        return EmpleadoMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Empleado> findById(Long id) {
        return obtenerPorId(id);
    }
}
