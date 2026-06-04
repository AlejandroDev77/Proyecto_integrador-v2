package com.changuitostudio.backend.infrastructure.controller;

import com.changuitostudio.backend.infrastructure.persistence.entity.FavoritoEntity;
import com.changuitostudio.backend.infrastructure.persistence.repository.FavoritoJpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cliente/favoritos")
public class FavoritoController {

    private final FavoritoJpaRepository favoritoRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    public FavoritoController(FavoritoJpaRepository favoritoRepository) {
        this.favoritoRepository = favoritoRepository;
    }

    /**
     * GET /api/cliente/favoritos - Obtener favoritos completos del cliente
     * Retorna lista de favoritos con detalles del mueble
     * Requiere autenticación (Bearer token o X-USER-ID header)
     */
    @GetMapping("")
    public ResponseEntity<List<Map<String, Object>>> getFavoritos(
            @RequestHeader(value = "X-USER-ID", required = false) Integer idUsu) {
        try {
            if (idUsu == null) {
                return ResponseEntity.badRequest()
                        .body(List.of());
            }

            // Buscar si existe un cliente con ese id_usu
            @SuppressWarnings("unchecked")
            List<Integer> clienteIds = (List<Integer>) entityManager
                .createNativeQuery("SELECT id_cli FROM clientes WHERE id_usu = ?1", Integer.class)
                .setParameter(1, idUsu)
                .getResultList();
            
            if (clienteIds.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }
            
            Integer idCli = clienteIds.get(0);
            
            // Query nativa para obtener favoritos con datos del mueble
            @SuppressWarnings("unchecked")
            List<Object[]> results = (List<Object[]>) entityManager
                .createNativeQuery(
                    "SELECT f.id_fav, f.id_cli, f.id_mue, m.id_mue, m.cod_mue, m.nom_mue, " +
                    "m.desc_mue, m.img_mue, m.precio_venta, m.stock, m.modelo_3d, c.nom_cat " +
                    "FROM favoritos f " +
                    "LEFT JOIN muebles m ON f.id_mue = m.id_mue " +
                    "LEFT JOIN categorias_muebles c ON m.id_cat = c.id_cat " +
                    "WHERE f.id_cli = ?1"
                )
                .setParameter(1, idCli)
                .getResultList();
            
            List<Map<String, Object>> favoritos = new java.util.ArrayList<>();
            for (Object[] row : results) {
                Map<String, Object> favMap = new java.util.HashMap<>();
                favMap.put("id_fav", row[0]);
                favMap.put("id_mue", row[2]);
                favMap.put("created_at", row[0]); // placeholder
                
                Map<String, Object> muebleMap = new java.util.HashMap<>();
                if (row[3] != null) {
                    muebleMap.put("id_mue", row[3]);
                    muebleMap.put("cod_mue", row[4]);
                    muebleMap.put("nom_mue", row[5]);
                    muebleMap.put("desc_mue", row[6]);
                    muebleMap.put("img_mue", row[7]);
                    muebleMap.put("precio_venta", row[8]);
                    muebleMap.put("stock", row[9]);
                    muebleMap.put("modelo_3d", row[10]);
                    muebleMap.put("categoria", row[11]);
                }
                favMap.put("mueble", !muebleMap.isEmpty() ? muebleMap : null);
                
                favoritos.add(favMap);
            }
            
            return ResponseEntity.ok(favoritos);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * GET /api/cliente/favoritos/ids - Obtener IDs de favoritos del cliente
     * Requiere que el cliente exista en la tabla clientes
     * Param: id_usu (id del usuario autenticado)
     */
    @GetMapping("/ids")
    public ResponseEntity<List<Object>> getFavoritoIds(
            @RequestParam(value = "id_usu") Integer idUsu) {
        try {
            // Buscar si existe un cliente con ese id_usu
            @SuppressWarnings("unchecked")
            List<Integer> clienteIds = (List<Integer>) entityManager
                .createNativeQuery("SELECT id_cli FROM clientes WHERE id_usu = ?1", Integer.class)
                .setParameter(1, idUsu)
                .getResultList();
            
            if (clienteIds.isEmpty()) {
                // Si no existe cliente, retornar array vacío
                return ResponseEntity.ok(List.of());
            }
            
            Integer idCli = clienteIds.get(0);
            List<FavoritoEntity> favoritos = favoritoRepository.findByIdCli(idCli);
            List<Object> ids = favoritos.stream()
                    .map(FavoritoEntity::getIdMue)
                    .map(Object.class::cast)
                    .toList();
            return ResponseEntity.ok(ids);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * POST /api/cliente/favoritos/toggle - Agregar/Eliminar favorito
     * Requiere que el cliente exista en la tabla clientes
     * Body: { id_usu: number, id_mue: number }
     */
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorito(
            @RequestBody Map<String, Integer> payload) {
        try {
            Integer idUsu = payload.get("id_usu");
            Integer idMue = payload.get("id_mue");

            if (idUsu == null || idMue == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "id_usu e id_mue son requeridos"));
            }

            // Buscar si existe un cliente con ese id_usu
            @SuppressWarnings("unchecked")
            List<Integer> clienteIds = (List<Integer>) entityManager
                .createNativeQuery("SELECT id_cli FROM clientes WHERE id_usu = ?1", Integer.class)
                .setParameter(1, idUsu)
                .getResultList();
            
            if (clienteIds.isEmpty()) {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "Cliente no encontrado para este usuario"));
            }
            
            Integer idCli = clienteIds.get(0);

            var existing = favoritoRepository.findByIdCliAndIdMue(idCli, idMue);

            if (existing.isPresent()) {
                // Eliminar favorito
                favoritoRepository.delete(existing.get());
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Favorito eliminado",
                        "action", "removed"
                ));
            } else {
                // Agregar favorito
                FavoritoEntity favorito = new FavoritoEntity(idCli, idMue);
                favoritoRepository.save(favorito);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Favorito agregado",
                        "action", "added",
                        "id_fav", favorito.getIdFav()
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
