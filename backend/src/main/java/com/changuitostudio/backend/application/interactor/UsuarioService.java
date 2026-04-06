package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.dto.PageResult;
import com.changuitostudio.backend.application.usecase.ManageUsuarioUseCase;
import com.changuitostudio.backend.application.gateway.UsuarioRepository;
import com.changuitostudio.backend.domain.exception.UsuarioNoEncontradoException;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.application.gateway.PasswordEncoderGateway;



import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio de aplicaciÃƒÂ³n Ã¢â‚¬â€ Implementa el caso de uso de gestiÃƒÂ³n de usuarios.
 * Solo depende de puertos (interfaces), no de infraestructura.
 */
public class UsuarioService implements ManageUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoderGateway passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoderGateway passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public PageResult<Usuario> listarUsuarios(int page, int perPage, Map<String, String> filters, String sort) {
        return usuarioRepository.buscarTodos(page, perPage, filters, sort);
    }

    @Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.buscarPorId(id);
    }

    @Override
    public Usuario crear(Usuario usuario) {
        String codigo = usuarioRepository.generarCodigoUnico();
        usuario.setCodUsu(codigo);

        String rawPassword = (usuario.getPasUsu() != null && !usuario.getPasUsu().isBlank())
                ? usuario.getPasUsu()
                : generarPasswordAleatorio(10);

        usuario.setPasUsu(passwordEncoder.encode(rawPassword));

        return usuarioRepository.guardar(usuario);
    }

    @Override
    public Usuario actualizar(Long id, Usuario usuario) {
        Usuario existente = usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));

        if (usuario.getNomUsu() != null)
            existente.setNomUsu(usuario.getNomUsu());
        if (usuario.getEmailUsu() != null)
            existente.setEmailUsu(usuario.getEmailUsu());
        if (usuario.getEstUsu() != null)
            existente.setEstUsu(usuario.getEstUsu());
        if (usuario.getIdRol() != null)
            existente.setIdRol(usuario.getIdRol());

        return usuarioRepository.guardar(existente);
    }

    @Override
    public void eliminar(Long id) {
        usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));
        usuarioRepository.eliminarPorId(id);
    }

    @Override
    public Usuario cambiarEstado(Long id, Boolean nuevoEstado) {
        Usuario existente = usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));

        existente.setEstUsu(nuevoEstado);
        return usuarioRepository.guardar(existente);
    }

    @Override
    public Optional<Usuario> obtenerPorNombre(String nomUsu) {
        return usuarioRepository.buscarPorNombre(nomUsu);
    }

    @Override
    public boolean existePorNomUsu(String nomUsu) {
        return usuarioRepository.existePorNomUsu(nomUsu);
    }

    @Override
    public boolean existePorEmail(String email) {
        return usuarioRepository.existePorEmail(email);
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



