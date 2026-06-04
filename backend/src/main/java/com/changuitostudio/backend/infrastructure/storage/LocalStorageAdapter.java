package com.changuitostudio.backend.infrastructure.storage;

import com.changuitostudio.backend.application.gateway.StorageGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class LocalStorageAdapter implements StorageGateway {

    @Value("${app.storage.location:storage}")
    private String storageLocation;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Override
    public String save(MultipartFile archivo, String folder) {
        try {
            // Asegurar que el directorio existe
            Path root = Paths.get(storageLocation).toAbsolutePath().normalize();
            Path targetDir = root.resolve(folder);
            
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Generar nombre único
            String extension = getExtension(archivo.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + (extension.isEmpty() ? "" : "." + extension);
            Path targetFile = targetDir.resolve(fileName);

            // Guardar archivo
            Files.copy(archivo.getInputStream(), targetFile);

            // Devolver URL (usando el prefijo /storage/ que configuraremos en WebConfig)
            return baseUrl + "/storage/" + folder + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo localmente: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String path) {
        // Implementación básica de eliminación
        try {
            if (path.startsWith(baseUrl + "/storage/")) {
                String relativePath = path.replace(baseUrl + "/storage/", "");
                Path fileToDelete = Paths.get(storageLocation).resolve(relativePath);
                Files.deleteIfExists(fileToDelete);
            }
        } catch (IOException e) {
            // Log error but don't fail
            System.err.println("No se pudo eliminar el archivo: " + path);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
