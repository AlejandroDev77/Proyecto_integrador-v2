package com.changuitostudio.backend.application.gateway;

import org.springframework.web.multipart.MultipartFile;

public interface StorageGateway {
    /**
     * Guarda un archivo y devuelve la URL pública.
     * @param archivo El archivo a guardar.
     * @param folder Carpeta de destino (ej: evidencias/images).
     * @return URL completa del archivo.
     */
    String save(MultipartFile archivo, String folder);
    
    /**
     * Elimina un archivo dado su path relativo o URL.
     * @param path El path o URL del archivo.
     */
    void delete(String path);
}
