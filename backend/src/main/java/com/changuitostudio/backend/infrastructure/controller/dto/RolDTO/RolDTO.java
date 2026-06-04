package com.changuitostudio.backend.infrastructure.controller.dto.RolDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RolDTO {

    @JsonProperty("id_rol")
    private Long idRol;

    @JsonProperty("nom_rol")
    private String nomRol;

    @JsonProperty("permisos")
    private List<PermisoConPivotDTO> permisos;

   
    public RolDTO() {
    }

   
    public RolDTO(Long idRol, String nomRol) {
        this.idRol = idRol;
        this.nomRol = nomRol;
    }

    
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

