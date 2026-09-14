package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.ClienteRepository;
import com.changuitostudio.backend.domain.model.Cliente;
import com.changuitostudio.backend.infrastructure.persistence.entity.ClienteEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.ClienteMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.ClienteJpaRepository;
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
public class ClienteJpaAdapter implements ClienteRepository {

    private final ClienteJpaRepository repository;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    public ClienteJpaAdapter(ClienteJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public PageResult<Cliente> listar(int page, int perPage, Map<String, String> filters, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortBy = sort.startsWith("-") ? sort.substring(1) : sort;
        
        // Convert snake_case to camelCase for JPA entity properties
        sortBy = GenericFilterSpecification.snakeToCamel(sortBy);

        Pageable pageable = PageRequest.of(page - 1, perPage, Sort.by(direction, sortBy));
        Page<ClienteEntity> entityPage = repository.findAll(ClienteSpecifications.byFilters(filters), pageable);

        List<Cliente> content = entityPage.getContent().stream()
                .map(ClienteMapper::toDomain)
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
    public Optional<Cliente> obtenerPorId(Long id) {
        return repository.findById(id).map(ClienteMapper::toDomain);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Cliente guardar(Cliente cliente) {
        ClienteEntity entity = ClienteMapper.toEntity(cliente);
        ClienteEntity saved = repository.saveAndFlush(entity);
        entityManager.refresh(saved);
        return ClienteMapper.toDomain(saved);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Cliente> findById(Long id) {
        return obtenerPorId(id);
    }

    @Override
    public Optional<Cliente> findByUsuarioId(Long idUsu) {
        return repository.findByUsuarioIdUsu(idUsu).map(ClienteMapper::toDomain);
    }
}
