package com.changuitostudio.backend.infrastructure.storage;

import com.changuitostudio.backend.application.gateway.StorageGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import java.net.URI;
import java.util.UUID;

@Service
@Primary
public class CloudflareR2StorageAdapter implements StorageGateway {

    private final S3Client s3Client;

    @Value("${app.r2.bucket}")
    private String bucket;

    @Value("${app.r2.public-url}")
    private String publicUrl;

    public CloudflareR2StorageAdapter(
            @Value("${app.r2.access-key-id}") String accessKey,
            @Value("${app.r2.secret-access-key}") String secretKey,
            @Value("${app.r2.endpoint}") String endpoint) {
        
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }

    @Override
    public String save(MultipartFile archivo, String folder) {
        try {
            String extension = "";
            String originalName = archivo.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String fileName = folder + "/" + UUID.randomUUID().toString() + extension;
            
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .contentType(archivo.getContentType())
                    .build();
                    
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(archivo.getInputStream(), archivo.getSize()));
            
            return publicUrl + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload to Cloudflare R2: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String path) {
        if (path == null || path.isEmpty()) return;
        try {
            String key = path.replace(publicUrl + "/", "");
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteRequest);
        } catch (Exception e) {
            System.err.println("Failed to delete from R2: " + e.getMessage());
        }
    }
}
