package com.changuitostudio.backend.infrastructure.controller.dto.GeneracionIADTO;

import java.time.LocalDateTime;
import java.util.List;

public class GeneracionIADTO {

    public static class GeneracionIARequestDTO {
        private String nom_mue;
        private List<String> imgs_ref;
        private String estado;
        private Long id_mue;
        private String modelo_3d_url;

        public String getNom_mue() { return nom_mue; }
        public void setNom_mue(String nom_mue) { this.nom_mue = nom_mue; }
        public List<String> getImgs_ref() { return imgs_ref; }
        public void setImgs_ref(List<String> imgs_ref) { this.imgs_ref = imgs_ref; }
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
        public Long getId_mue() { return id_mue; }
        public void setId_mue(Long id_mue) { this.id_mue = id_mue; }
        public String getModelo_3d_url() { return modelo_3d_url; }
        public void setModelo_3d_url(String modelo_3d_url) { this.modelo_3d_url = modelo_3d_url; }
    }

    public static class GeneracionIAResponseDTO {
        private Long id;
        private String nombre_mueble;
        private List<String> imagenes_referencia;
        private String modelo_3d_url;
        private String estado;
        private LocalDateTime fecha_creacion;
        private Long id_mueble;

        public GeneracionIAResponseDTO(Long id, String nombre_mueble, List<String> imagenes_referencia, String modelo_3d_url, String estado, LocalDateTime fecha_creacion, Long id_mueble) {
            this.id = id;
            this.nombre_mueble = nombre_mueble;
            this.imagenes_referencia = imagenes_referencia;
            this.modelo_3d_url = modelo_3d_url;
            this.estado = estado;
            this.fecha_creacion = fecha_creacion;
            this.id_mueble = id_mueble;
        }

        public Long getId() { return id; }
        public String getNombre_mueble() { return nombre_mueble; }
        public List<String> getImagenes_referencia() { return imagenes_referencia; }
        public String getModelo_3d_url() { return modelo_3d_url; }
        public String getEstado() { return estado; }
        public LocalDateTime getFecha_creacion() { return fecha_creacion; }
        public Long getId_mueble() { return id_mueble; }
    }
}
