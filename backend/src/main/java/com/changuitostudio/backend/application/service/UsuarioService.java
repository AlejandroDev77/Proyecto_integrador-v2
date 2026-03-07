package com.changuitostudio.backend.application.service;

import com.changuitostudio.backend.application.port.in.UsuarioServicePort;
import com.changuitostudio.backend.application.port.out.UsuarioPersistencePort;
import com.changuitostudio.backend.domain.exception.UsuarioNoEncontradoException;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.infrastructure.adapter.out.persistence.UsuarioSpecifications;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio de aplicación — Implementa el puerto de entrada.
 * Orquesta la lógica de negocio de Usuarios.
 */
@Service
public class UsuarioService implements UsuarioServicePort {

    private final UsuarioPersistencePort persistencePort;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioPersistencePort persistencePort) {
        this.persistencePort = persistencePort;
    }

    @Override
    public Page<Usuario> listarUsuarios(int page, int perPage, Map<String, String> filters, String sort) {
        // Construir Specification desde los filtros
        var spec = UsuarioSpecifications.fromFilters(filters);

        // Construir Pageable con sort
        Pageable pageable = buildPageable(page, perPage, sort);

        return persistencePort.buscarTodos(spec, pageable);
    }

    @Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return persistencePort.buscarPorId(id);
    }

    @Override
    public Usuario crear(Usuario usuario) {
        // Generar código automático (USU-1, USU-2, ...)
        String codigo = persistencePort.generarCodigoUnico();
        usuario.setCodUsu(codigo);

        // Generar contraseña aleatoria y encriptarla
        String rawPassword = generarPasswordAleatorio(10);
        usuario.setPasUsu(passwordEncoder.encode(rawPassword));

        return persistencePort.guardar(usuario);
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuario) {
        Usuario existente = persistencePort.buscarPorId(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));

        // Solo actualizar campos proporcionados
        if (usuario.getNomUsu() != null)
            existente.setNomUsu(usuario.getNomUsu());
        if (usuario.getEmailUsu() != null)
            existente.setEmailUsu(usuario.getEmailUsu());
        if (usuario.getEstUsu() != null)
            existente.setEstUsu(usuario.getEstUsu());
        if (usuario.getIdRol() != null)
            existente.setIdRol(usuario.getIdRol());

        return persistencePort.guardar(existente);
    }

    @Override
    public void eliminar(Long id) {
        persistencePort.buscarPorId(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));
        persistencePort.eliminarPorId(id);
    }

    @Override
    public Usuario cambiarEstado(Long id, Boolean nuevoEstado) {
        Usuario existente = persistencePort.buscarPorId(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));

        existente.setEstUsu(nuevoEstado);
        return persistencePort.guardar(existente);
    }

    // ── Helpers privados ───────────────────────────────────────

    private Pageable buildPageable(int page, int perPage, String sort) {
        if (sort != null && !sort.isBlank()) {
            // El frontend envía sort como "-nom_usu" para DESC o "nom_usu" para ASC
            Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
            String field = sort.startsWith("-") ? sort.substring(1) : sort;

            // Convertir nombres de campo Laravel → JPA
            String jpaField = mapSortField(field);
            return PageRequest.of(page - 1, perPage, Sort.by(direction, jpaField));
        }
        return PageRequest.of(page - 1, perPage);
    }

    private String mapSortField(String laravelField) {
        return switch (laravelField) {
            case "nom_usu" -> "nomUsu";
            case "email_usu" -> "emailUsu";
            case "cod_usu" -> "codUsu";
            case "est_usu" -> "estUsu";
            default -> laravelField;
        };
    }

    private String generarPasswordAleatorio(int length) {
        String chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
