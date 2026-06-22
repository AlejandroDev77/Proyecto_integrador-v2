package com.changuitostudio.backend.infrastructure.storage;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.UUID;

/**
 * Servicio para subir archivos a Cloudflare R2.
 * R2 es compatible con la API de S3 de Amazon, por lo que se usa el AWS SDK v2.
 *
 * Las credenciales se inyectan desde application.properties:
 *   app.r2.access-key-id
 *   app.r2.secret-access-key
 *   app.r2.endpoint
 *   app.r2.bucket
 *   app.r2.public-url
 */
@Service
public class CloudflareR2Service {

    @Value("${app.r2.access-key-id}")
    private String accessKeyId;

    @Value("${app.r2.secret-access-key}")
    private String secretAccessKey;

    @Value("${app.r2.endpoint}")
    private String endpoint;

    @Value("${app.r2.bucket}")
    private String bucket;

    @Value("${app.r2.public-url}")
    private String publicUrl;

    private S3Client s3Client;

    @PostConstruct
    public void init() {
        s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                ))
                .build();
    }

    /**
     * Sube bytes crudos a Cloudflare R2.
     *
     * @param data        Contenido del archivo en bytes
     * @param folder      Carpeta dentro del bucket (ej: "modelos-3d")
     * @param fileName    Nombre del archivo con extensión (ej: "modelo.glb")
     * @param contentType MIME type (ej: "model/gltf-binary" para GLB)
     * @return URL pública del archivo subido
     */
    public String uploadBytes(byte[] data, String folder, String fileName, String contentType) {
        String key = folder + "/" + fileName;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .contentLength((long) data.length)
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(data));

        return publicUrl + "/" + key;
    }

    /**
     * Sube bytes a R2 generando un nombre único con UUID.
     *
     * @param data        Contenido del archivo en bytes
     * @param folder      Carpeta dentro del bucket
     * @param extension   Extensión del archivo sin punto (ej: "glb")
     * @param contentType MIME type
     * @return URL pública del archivo subido
     */
    public String uploadBytesWithUUID(byte[] data, String folder, String extension, String contentType) {
        String fileName = UUID.randomUUID() + "." + extension;
        return uploadBytes(data, folder, fileName, contentType);
    }
}
