package com.changuitostudio.backend.application.port.in;

import com.changuitostudio.backend.domain.model.Usuario;
import org.springframework.data.domain.Page;

import java.util.Map;
import java.util.Optional;


 //Puerto de ENTRADA — Operaciones del caso de uso de Usuarios.
 
public interface UsuarioServicePort {

    
    //  Listar usuarios con paginación y filtros (compatible con formato Laravel).
     
    Page<Usuario> listarUsuarios(int page, int perPage, Map<String, String> filters, String sort);

    Optional<Usuario> obtenerPorId(Long id);

    Usuario crear(Usuario usuario);

    Usuario actualizar(Long id, Usuario usuario);

    void eliminar(Long id);

    Usuario cambiarEstado(Long id, Boolean nuevoEstado);

    Optional<Usuario> obtenerPorNombre(String nomUsu);

    boolean existePorNomUsu(String nomUsu);

    boolean existePorEmail(String email);
}
