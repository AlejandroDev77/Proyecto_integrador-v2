package com.changuitostudio.backend.application.interactor;

import com.changuitostudio.backend.application.usecase.LoginUseCase;
import com.changuitostudio.backend.application.gateway.*;
import com.changuitostudio.backend.domain.exception.CredencialesInvalidasException;
import com.changuitostudio.backend.domain.exception.UsuarioNoEncontradoException;
import com.changuitostudio.backend.domain.model.Permiso;
//import com.changuitostudio.backend.domain.model.Rol;
import com.changuitostudio.backend.domain.model.Usuario;



import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class LoginService implements LoginUseCase {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final JwtProvider jwtProvider;
    private final GoogleAuthProvider googleAuthProvider;
    private final TwoFactorAuthCoreService tfaCoreService;
    private final PasswordEncoderGateway passwordEncoder;

    public LoginService(UsuarioRepository usuarioRepository,
                        RolRepository rolRepository,
                        JwtProvider jwtProvider,
                        GoogleAuthProvider googleAuthProvider,
                        TwoFactorAuthCoreService tfaCoreService,
                        PasswordEncoderGateway passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.jwtProvider = jwtProvider;
        this.googleAuthProvider = googleAuthProvider;
        this.tfaCoreService = tfaCoreService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResult login(String nombreUsuario, String password) {
        Usuario usuario = usuarioRepository.buscarPorNombre(nombreUsuario)
                .orElseThrow(CredencialesInvalidasException::new);

        if (!passwordEncoder.matches(password, usuario.getPasUsu())) {
            throw new CredencialesInvalidasException();
        }

        // Si tiene 2FA habilitado
        if (Boolean.TRUE.equals(usuario.getIs2faEnabled())) {
            String tempToken = jwtProvider.generate2faTempToken(usuario.getIdUsu());
            return LoginResult.requires2fa(tempToken);
        }

        List<String> permisos = obtenerPermisos(usuario.getIdRol());
        String token = jwtProvider.generateToken(
                usuario.getIdUsu(), usuario.getIdRol(), usuario.getCodUsu(),
                usuario.getNomUsu(), usuario.getEmailUsu(), permisos);

        return LoginResult.success(token);
    }

    @Override
    public LoginResult loginWithGoogle(String googleIdToken) {
        try {
            GoogleAuthProvider.GoogleUserInfo googleUser = googleAuthProvider.verifyToken(googleIdToken);

            Usuario usuario = usuarioRepository.buscarPorEmail(googleUser.email())
                    .orElseGet(() -> crearUsuarioGoogle(googleUser));

            if (!Boolean.TRUE.equals(usuario.getEstUsu())) {
                throw new CredencialesInvalidasException("Tu cuenta se encuentra deshabilitada.");
            }

            if (Boolean.TRUE.equals(usuario.getIs2faEnabled())) {
                String tempToken = jwtProvider.generate2faTempToken(usuario.getIdUsu());
                return LoginResult.requires2fa(tempToken);
            }

            List<String> permisos = obtenerPermisos(usuario.getIdRol());
            String token = jwtProvider.generateToken(
                    usuario.getIdUsu(), usuario.getIdRol(), usuario.getCodUsu(),
                    usuario.getNomUsu(), usuario.getEmailUsu(), permisos);

            return LoginResult.success(token);
        } catch (CredencialesInvalidasException e) {
            throw e;
        } catch (Exception e) {
            throw new CredencialesInvalidasException("No se pudo verificar el token de Google: " + e.getMessage());
        }
    }

    @Override
    public LoginResult verify2fa(String tempToken, String code) {
        if (!jwtProvider.validateToken(tempToken)) {
            throw new CredencialesInvalidasException("Token temporal invÃ¡lido o expirado.");
        }

        Long idUsu = Long.parseLong(jwtProvider.getSubjectFromToken(tempToken));
        Usuario usuario = usuarioRepository.buscarPorId(idUsu)
                .orElseThrow(() -> new UsuarioNoEncontradoException(idUsu));

        if (!tfaCoreService.isOtpValid(usuario.getSecret2fa(), code)) {
            throw new CredencialesInvalidasException("CÃ³digo 2FA incorrecto.");
        }

        List<String> permisos = obtenerPermisos(usuario.getIdRol());
        String token = jwtProvider.generateToken(
                usuario.getIdUsu(), usuario.getIdRol(), usuario.getCodUsu(),
                usuario.getNomUsu(), usuario.getEmailUsu(), permisos);

        return LoginResult.success(token);
    }

    // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private List<String> obtenerPermisos(Long idRol) {
        if (idRol == null) return Collections.emptyList();
        return rolRepository.buscarPorId(idRol)
                .map(rol -> rol.getPermisos().stream()
                        .map(Permiso::getNomPermiso)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    private Usuario crearUsuarioGoogle(GoogleAuthProvider.GoogleUserInfo googleUser) {
        Usuario nuevo = new Usuario();
        nuevo.setNomUsu(googleUser.email().split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 4));
        nuevo.setEmailUsu(googleUser.email());
        nuevo.setPasUsu(""); // No tiene password, usa Google
        nuevo.setEstUsu(true);
        nuevo.setIdRol(3L); // Rol cliente por defecto

        String codigo = usuarioRepository.generarCodigoUnico();
        nuevo.setCodUsu("G-" + codigo.replace("USU-", ""));

        return usuarioRepository.guardar(nuevo);
    }
}


