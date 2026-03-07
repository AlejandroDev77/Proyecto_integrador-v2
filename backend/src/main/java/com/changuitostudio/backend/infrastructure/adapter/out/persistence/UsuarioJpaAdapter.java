package com.changuitostudio.backend.infrastructure.adapter.out.persistence;

import com.changuitostudio.backend.application.port.out.UsuarioPersistencePort;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.entity.UsuarioEntity;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.mapper.UsuarioMapper;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.repository.UsuarioJpaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Adaptador de SALIDA — Implementa el puerto de persistencia con JPA.
 */
@Component
public class UsuarioJpaAdapter implements UsuarioPersistencePort {

    private final UsuarioJpaRepository jpaRepository;
    private final UsuarioMapper mapper;

    @PersistenceContext
    private EntityManager entityManager;

    public UsuarioJpaAdapter(UsuarioJpaRepository jpaRepository, UsuarioMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Page<Usuario> buscarTodos(Specification<UsuarioEntity> spec, Pageable pageable) {
        return jpaRepository.findAll(spec, pageable)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    @Transactional
    public Usuario guardar(Usuario usuario) {
        UsuarioEntity entity = mapper.toEntity(usuario);
        UsuarioEntity saved = jpaRepository.saveAndFlush(entity);

        // Limpiar cache de Hibernate para forzar recarga con relación de rol
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
        // Optimizado: obtener el máximo ID actual en una sola consulta
        long count = jpaRepository.count();
        int nextId = (int) count + 1;
        String codigo;
        do {
            codigo = "USU-" + nextId;
            nextId++;
        } while (jpaRepository.existsByCodUsu(codigo));
        return codigo;
    }
}
