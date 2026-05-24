package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ProduccionEtapaRepository;
import com.changuitostudio.backend.domain.model.ProduccionEtapa;
import com.changuitostudio.backend.infrastructure.persistence.entity.ProduccionEtapaEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.ProduccionEtapaMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.ProduccionEtapaJpaRepository;
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
public class ProduccionEtapaJpaAdapter implements ProduccionEtapaRepository {

    private final ProduccionEtapaJpaRepository repository;

    public ProduccionEtapaJpaAdapter(ProduccionEtapaJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<ProduccionEtapa> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<ProduccionEtapaEntity> entityPage = repository.findAll(ProduccionEtapaSpecifications.byFilters(filters), pageable);

        List<ProduccionEtapa> content = entityPage.getContent().stream()
                .map(ProduccionEtapaMapper::toDomain)
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
    public Optional<ProduccionEtapa> obtenerPorId(Long id) {
        return repository.findById(id).map(ProduccionEtapaMapper::toDomain);
    }

    @Override
    public ProduccionEtapa guardar(ProduccionEtapa produccionetapa) {
        ProduccionEtapaEntity entity = ProduccionEtapaMapper.toEntity(produccionetapa);
        return ProduccionEtapaMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodProEta(codigo);
    }

    @Override
    public ProduccionEtapa save(ProduccionEtapa produccionEtapa) {
        return guardar(produccionEtapa);
    }
}
