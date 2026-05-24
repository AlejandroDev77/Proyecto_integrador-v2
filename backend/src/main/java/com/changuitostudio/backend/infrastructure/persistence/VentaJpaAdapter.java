package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.VentaRepository;
import com.changuitostudio.backend.domain.model.Venta;
import com.changuitostudio.backend.infrastructure.persistence.entity.VentaEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.VentaMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.VentaJpaRepository;
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
public class VentaJpaAdapter implements VentaRepository {

    private final VentaJpaRepository repository;

    public VentaJpaAdapter(VentaJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Venta> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<VentaEntity> entityPage = repository.findAll(VentaSpecifications.byFilters(filters), pageable);

        List<Venta> content = entityPage.getContent().stream()
                .map(VentaMapper::toDomain)
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
    public Optional<Venta> obtenerPorId(Long id) {
        return repository.findById(id).map(VentaMapper::toDomain);
    }

    @Override
    public Venta guardar(Venta venta) {
        VentaEntity entity = VentaMapper.toEntity(venta);
        return VentaMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Venta> findById(Long id) {
        return obtenerPorId(id);
    }

    @Override
    public Venta save(Venta venta) {
        return guardar(venta);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodVen(codigo);
    }

    @Override
    public long countByFecVen(LocalDate fecha) {
        return repository.countByFecVen(fecha);
    }
}
