package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.CotizacionRepository;
import com.changuitostudio.backend.domain.model.Cotizacion;
import com.changuitostudio.backend.infrastructure.persistence.entity.CotizacionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.CotizacionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.CotizacionJpaRepository;
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
public class CotizacionJpaAdapter implements CotizacionRepository {

    private final CotizacionJpaRepository repository;

    public CotizacionJpaAdapter(CotizacionJpaRepository repository) {
        this.repository = repository;
    }

    /**
     * Converts snake_case to camelCase for JPA property mapping.
     * e.g., "fec_cot" -> "fecCot", "fec_fin_estimada" -> "fecFinEstimada"
     */
    private String snakeToCamel(String snake) {
        if (snake == null || !snake.contains("_")) return snake;
        StringBuilder sb = new StringBuilder();
        boolean upper = false;
        for (char c : snake.toCharArray()) {
            if (c == '_') { upper = true; }
            else { sb.append(upper ? Character.toUpperCase(c) : c); upper = false; }
        }
        return sb.toString();
    }

    @Override
    public PageResult<Cotizacion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<CotizacionEntity> entityPage = repository.findAll(CotizacionSpecifications.byFilters(filters), pageable);

        List<Cotizacion> content = entityPage.getContent().stream()
                .map(CotizacionMapper::toDomain)
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
    public Optional<Cotizacion> obtenerPorId(Long id) {
        return repository.findById(id).map(CotizacionMapper::toDomain);
    }

    @Override
    public Cotizacion guardar(Cotizacion cotizacion) {
        CotizacionEntity entity = CotizacionMapper.toEntity(cotizacion);
        return CotizacionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // ✨ Métodos para módulo de negocio

    @Override
    public Optional<Cotizacion> findById(Long id) {
        return obtenerPorId(id);
    }

    @Override
    public Cotizacion save(Cotizacion cotizacion) {
        return guardar(cotizacion);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodCot(codigo);
    }

    @Override
    public long countByEstCot(String estado) {
        return repository.countByEstCot(estado);
    }
}
