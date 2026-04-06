package com.changuitostudio.backend.infrastructure.persistence;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.gateway.UsuarioRepository;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.infrastructure.persistence.entity.UsuarioEntity;
import com.changuitostudio.backend.infrastructure.persistence.mapper.UsuarioMapper;
import com.changuitostudio.backend.infrastructure.persistence.repository.UsuarioJpaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

/**
 * Adaptador de salida â€” Implementa el puerto UsuarioRepository con JPA.
 * La traducciÃ³n de filtros a Specification ocurre AQUÃ, no en la capa de aplicaciÃ³n.
 */
@Component
public class UsuarioJpaAdapter implements UsuarioRepository {

    private final UsuarioJpaRepository jpaRepository;
    private final UsuarioMapper mapper;

    @PersistenceContext
    private EntityManager entityManager;

    public UsuarioJpaAdapter(UsuarioJpaRepository jpaRepository, UsuarioMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public PageResult<Usuario> buscarTodos(int page, int size, Map<String, String> filters, String sort) {
        // Traducir filtros genÃ©ricos â†’ JPA Specification (aquÃ­ SÃ se puede usar JPA)
        Specification<UsuarioEntity> spec = UsuarioSpecifications.fromFilters(filters);
        Pageable pageable = buildPageable(page, size, sort);

        Page<UsuarioEntity> resultado = jpaRepository.findAll(spec, pageable);

        return new PageResult<>(
                resultado.getContent().stream().map(mapper::toDomain).toList(),
                page,
                size,
                resultado.getTotalElements()
        );
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorNombre(String nomUsu) {
        return jpaRepository.findByNomUsu(nomUsu).map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return jpaRepository.findByEmailUsu(email).map(mapper::toDomain);
    }

    @Override
    @Transactional
    public Usuario guardar(Usuario usuario) {
        UsuarioEntity entity = mapper.toEntity(usuario);
        UsuarioEntity saved = jpaRepository.saveAndFlush(entity);

        entityManager.detach(saved);
        saved = jpaRepository.findById(saved.getIdUsu()).orElse(saved);

        return mapper.toDomain(saved);
    }

    @Override
    public void eliminarPorId(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public String generarCodigoUnico() {
        long count = jpaRepository.count();
        int nextId = (int) count + 1;
        String codigo;
        do {
            codigo = "USU-" + nextId;
            nextId++;
        } while (jpaRepository.existsByCodUsu(codigo));
        return codigo;
    }

    @Override
    public boolean existePorNomUsu(String nomUsu) {
        return jpaRepository.existsByNomUsu(nomUsu);
    }

    @Override
    public boolean existePorEmail(String email) {
        return jpaRepository.existsByEmailUsu(email);
    }

    // â”€â”€ Helpers privados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private Pageable buildPageable(int page, int size, String sort) {
        if (sort != null && !sort.isBlank()) {
            Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
            String field = sort.startsWith("-") ? sort.substring(1) : sort;
            String jpaField = mapSortField(field);
            return PageRequest.of(page - 1, size, Sort.by(direction, jpaField));
        }
        return PageRequest.of(page - 1, size);
    }

    private String mapSortField(String field) {
        return switch (field) {
            case "nom_usu" -> "nomUsu";
            case "email_usu" -> "emailUsu";
            case "cod_usu" -> "codUsu";
            case "est_usu" -> "estUsu";
            default -> field;
        };
    }
}

