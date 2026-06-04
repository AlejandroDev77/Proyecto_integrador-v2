package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.PagoRepository;
import com.changuitostudio.backend.domain.model.Pago;
import com.changuitostudio.backend.infrastructure.persistence.entity.PagoEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.PagoMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.PagoJpaRepository;
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
public class PagoJpaAdapter implements PagoRepository {

    private final PagoJpaRepository repository;

    public PagoJpaAdapter(PagoJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Pago> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<PagoEntity> entityPage = repository.findAll(PagoSpecifications.byFilters(filters), pageable);

        List<Pago> content = entityPage.getContent().stream()
                .map(PagoMapper::toDomain)
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
    public Optional<Pago> obtenerPorId(Long id) {
        return repository.findById(id).map(PagoMapper::toDomain);
    }

    @Override
    public Pago guardar(Pago pago) {
        PagoEntity entity = PagoMapper.toEntity(pago);
        return PagoMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodPag(codigo);
    }

    @Override
    public Pago save(Pago pago) {
        return guardar(pago);
    }
}
