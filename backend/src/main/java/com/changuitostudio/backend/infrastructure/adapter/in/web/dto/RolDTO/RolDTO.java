package com.changuitostudio.backend.infrastructure.adapter.in.web.dto.RolDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * ✅ DTO para respuesta de listar roles CON permisos y pivot
 * 
 * Usado en: GET /api/roles
 * 
 * Estructura de respuesta (Laravel-compatible):
 * [
 *   {
 *     "id_rol": 1,
 *     "nom_rol": "Administrador",
 *     "permisos": [
 *       {
 *         "id_permiso": 2,
 *         "nombre": "ver_reportes",
 *         "descripcion": "Ver reportes generales",
 *         "pivot": {
 *           "id_rol": 1,
 *           "id_permiso": 2
 *         }
 *       }
 *     ]
 *   }
 * ]
 */
public class RolDTO {

    @JsonProperty("id_rol")
    private Long idRol;

    @JsonProperty("nom_rol")
    private String nomRol;

    @JsonProperty("permisos")
    private List<PermisoConPivotDTO> permisos;

    // ✅ Constructor vacío para deserialización
    public RolDTO() {
    }

    // ✅ Constructor con parámetros
    public RolDTO(Long idRol, String nomRol) {
        this.idRol = idRol;
        this.nomRol = nomRol;
    }

    // ✅ Constructor con permisos
    public RolDTO(Long idRol, String nomRol, List<PermisoConPivotDTO> permisos) {
        this.idRol = idRol;
        this.nomRol = nomRol;
        this.permisos = permisos;
    }

    // Getters y Setters
    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public String getNomRol() {
        return nomRol;
    }

    public void setNomRol(String nomRol) {
        this.nomRol = nomRol;
    }

    public List<PermisoConPivotDTO> getPermisos() {
        return permisos;
    }

    public void setPermisos(List<PermisoConPivotDTO> permisos) {
        this.permisos = permisos;
    }

    // ✅ DTO INTERNO: Permiso con Pivot (tabla intermedia)
    public static class PermisoConPivotDTO {
        @JsonProperty("id_permiso")
        private Long idPermiso;

        @JsonProperty("nombre")
        private String nombre;

        @JsonProperty("descripcion")
        private String descripcion;

        @JsonProperty("pivot")
        private PivotDTO pivot;

        // Constructores
        public PermisoConPivotDTO() {
        }

        public PermisoConPivotDTO(Long idPermiso, String nombre, String descripcion, Long idRol) {
            this.idPermiso = idPermiso;
            this.nombre = nombre;
            this.descripcion = descripcion;
            this.pivot = new PivotDTO(idRol, idPermiso);
        }

        // Getters y Setters
        public Long getIdPermiso() {
            return idPermiso;
        }

        public void setIdPermiso(Long idPermiso) {
            this.idPermiso = idPermiso;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }

        public PivotDTO getPivot() {
            return pivot;
        }

        public void setPivot(PivotDTO pivot) {
            this.pivot = pivot;
        }

        // ✅ DTO INTERNO: Pivot (relación Many-to-Many)
        public static class PivotDTO {
            @JsonProperty("id_rol")
            private Long idRol;

            @JsonProperty("id_permiso")
            private Long idPermiso;

            // Constructores
            public PivotDTO() {
            }

            public PivotDTO(Long idRol, Long idPermiso) {
                this.idRol = idRol;
                this.idPermiso = idPermiso;
            }

            // Getters y Setters
            public Long getIdRol() {
                return idRol;
            }

            public void setIdRol(Long idRol) {
                this.idRol = idRol;
            }

            public Long getIdPermiso() {
                return idPermiso;
            }

            public void setIdPermiso(Long idPermiso) {
                this.idPermiso = idPermiso;
            }
        }
    }

    @Override
    public String toString() {
        return "RolDTO{" +
                "idRol=" + idRol +
                ", nomRol='" + nomRol + '\'' +
                ", permisos=" + permisos +
                '}';
    }
}
