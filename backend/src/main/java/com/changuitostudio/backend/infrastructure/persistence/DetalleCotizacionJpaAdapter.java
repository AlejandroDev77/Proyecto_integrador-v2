package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.DetalleCotizacionRepository;
import com.changuitostudio.backend.domain.model.DetalleCotizacion;
import com.changuitostudio.backend.infrastructure.persistence.entity.DetalleCotizacionEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.DetalleCotizacionMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.DetalleCotizacionJpaRepository;
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
public class DetalleCotizacionJpaAdapter implements DetalleCotizacionRepository {

    private final DetalleCotizacionJpaRepository repository;

    public DetalleCotizacionJpaAdapter(DetalleCotizacionJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<DetalleCotizacion> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<DetalleCotizacionEntity> entityPage = repository.findAll(DetalleCotizacionSpecifications.byFilters(filters), pageable);

        List<DetalleCotizacion> content = entityPage.getContent().stream()
                .map(DetalleCotizacionMapper::toDomain)
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
    public Optional<DetalleCotizacion> obtenerPorId(Long id) {
        return repository.findById(id).map(DetalleCotizacionMapper::toDomain);
    }

    @Override
    public DetalleCotizacion guardar(DetalleCotizacion detallecotizacion) {
        DetalleCotizacionEntity entity = DetalleCotizacionMapper.toEntity(detallecotizacion);
        return DetalleCotizacionMapper.toDomain(repository.save(entity));
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return repository.existsByCodDetCot(codigo);
    }

    @Override
    public List<DetalleCotizacion> findByCotizacionId(Long idCot) {
        return repository.findByCotizacionId(idCot).stream()
                .map(DetalleCotizacionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public DetalleCotizacion save(DetalleCotizacion detalleCotizacion) {
        return guardar(detalleCotizacion);
    }

    @Override
    public Optional<DetalleCotizacion> findById(Long id) {
        return obtenerPorId(id);
    }
}
