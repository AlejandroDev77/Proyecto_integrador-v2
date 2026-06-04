package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DevolucionRepository;
import com.changuitostudio.backend.domain.model.Devolucion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DevolucionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.DevolucionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.DevolucionJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DevolucionJpaAdapter implements DevolucionRepository {

    private final DevolucionJpaRepository repository;

    public DevolucionJpaAdapter(DevolucionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Devolucion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<DevolucionEntity> entityPage = repository.findAll(DevolucionSpecifications.byFilters(filters), pageable);

        List<Devolucion> content = entityPage.getContent().stream()
                .map(DevolucionMapper::toDomain)
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
    public Optional<Devolucion> obtenerPorId(Long id) {
        return repository.findById(id).map(DevolucionMapper::toDomain);
    }

    @Override
    public Devolucion guardar(Devolucion devolucion) {
        DevolucionEntity entity = DevolucionMapper.toEntity(devolucion);
        return DevolucionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodDev(codigo);
    }

    @Override
    public long countByFecDevMonth(int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return repository.countByFecDevBetween(start, end);
    }

    @Override
    public Devolucion save(Devolucion devolucion) {
        return guardar(devolucion);
    }
}
