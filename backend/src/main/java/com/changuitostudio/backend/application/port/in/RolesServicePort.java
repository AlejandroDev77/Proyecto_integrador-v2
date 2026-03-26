package com.changuitostudio.backend.application.port.in;

import com.changuitostudio.backend.domain.model.Rol;
import org.springframework.data.domain.Page;

import java.util.Map;
import java.util.Optional;

// ✅ SOLUCIÓN: Debe ser 'interface', no 'class'
// En Spring, los puertos de entrada son interfaces que definen el contrato de uso
public interface RolesServicePort {

    // ✅ NOTA: Métodos de interfaz NO llevan 'public' explícito (ya lo son por defecto)
    // ✅ NOTA: Deben terminar con ';' en interfaces
    Page<Rol> listarRoles(int page, int perPage, Map<String, String> filters, String sort);

    // ✅ Cambio: 'ObtenerPorId' → 'obtenerPorId' (convención camelCase con minúscula inicial)
    Optional<Rol> obtenerPorId(Long id);

    Rol crear(Rol rol);

    Rol actualizar(Long id, Rol rol);

    void eliminar(Long id);
}
