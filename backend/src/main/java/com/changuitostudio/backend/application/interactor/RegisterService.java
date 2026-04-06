package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.usecase.RegisterUseCase;
import com.changuitostudio.backend.application.gateway.UsuarioRepository;
import com.changuitostudio.backend.domain.model.Usuario;
import com.changuitostudio.backend.application.gateway.PasswordEncoderGateway;



public class RegisterService implements RegisterUseCase {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoderGateway passwordEncoder;

    public RegisterService(UsuarioRepository usuarioRepository, PasswordEncoderGateway passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario register(String nombreUsuario, String email, String password, Long idRol) {
        // Validar unicidad
        if (usuarioRepository.existePorNomUsu(nombreUsuario)) {
            throw new IllegalArgumentException("El nombre de usuario ya estÃƒÂ¡ en uso.");
        }
        if (usuarioRepository.existePorEmail(email)) {
            throw new IllegalArgumentException("El email ya estÃƒÂ¡ en uso.");
        }

        Usuario nuevo = new Usuario();
        nuevo.setNomUsu(nombreUsuario);
        nuevo.setEmailUsu(email);
        nuevo.setPasUsu(passwordEncoder.encode(password));
        nuevo.setEstUsu(true);
        nuevo.setIdRol(idRol);

        String codigo = usuarioRepository.generarCodigoUnico();
        nuevo.setCodUsu(codigo);

        return usuarioRepository.guardar(nuevo);
    }
}



