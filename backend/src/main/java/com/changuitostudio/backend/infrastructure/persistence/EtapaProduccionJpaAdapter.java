package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.EtapaProduccionRepository;
import com.changuitostudio.backend.domain.model.EtapaProduccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.EtapaProduccionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.EtapaProduccionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.EtapaProduccionJpaRepository;
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
public class EtapaProduccionJpaAdapter implements EtapaProduccionRepository {

    private final EtapaProduccionJpaRepository repository;

    public EtapaProduccionJpaAdapter(EtapaProduccionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<EtapaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<EtapaProduccionEntity> entityPage = repository.findAll(EtapaProduccionSpecifications.byFilters(filters), pageable);

        List<EtapaProduccion> content = entityPage.getContent().stream()
                .map(EtapaProduccionMapper::toDomain)
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
    public Optional<EtapaProduccion> obtenerPorId(Long id) {
        return repository.findById(id).map(EtapaProduccionMapper::toDomain);
    }

    @Override
    public EtapaProduccion guardar(EtapaProduccion etapaproduccion) {
        EtapaProduccionEntity entity = EtapaProduccionMapper.toEntity(etapaproduccion);
        return EtapaProduccionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<EtapaProduccion> findById(Long id) {
        return obtenerPorId(id);
    }
}
