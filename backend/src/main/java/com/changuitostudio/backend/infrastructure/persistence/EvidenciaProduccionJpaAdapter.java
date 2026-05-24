package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.EvidenciaProduccionRepository;
import com.changuitostudio.backend.domain.model.EvidenciaProduccion;
import com.changuitostudio.backend.infrastructure.persistence.entity.EvidenciaProduccionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.EvidenciaProduccionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.EvidenciaProduccionJpaRepository;
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
public class EvidenciaProduccionJpaAdapter implements EvidenciaProduccionRepository {

    private final EvidenciaProduccionJpaRepository repository;

    public EvidenciaProduccionJpaAdapter(EvidenciaProduccionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<EvidenciaProduccion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<EvidenciaProduccionEntity> entityPage = repository.findAll(EvidenciaProduccionSpecifications.byFilters(filters), pageable);

        List<EvidenciaProduccion> content = entityPage.getContent().stream()
                .map(EvidenciaProduccionMapper::toDomain)
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
    public Optional<EvidenciaProduccion> obtenerPorId(Long id) {
        return repository.findById(id).map(EvidenciaProduccionMapper::toDomain);
    }

    @Override
    public EvidenciaProduccion guardar(EvidenciaProduccion evidenciaproduccion) {
        EvidenciaProduccionEntity entity = EvidenciaProduccionMapper.toEntity(evidenciaproduccion);
        return EvidenciaProduccionMapper.toDomain(repository.save(entity));
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodEvi(codigo);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
