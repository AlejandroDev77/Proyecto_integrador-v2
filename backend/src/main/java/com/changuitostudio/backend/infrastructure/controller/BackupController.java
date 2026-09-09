package com.changuitostudio.backend.infrastructure.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
public class BackupController {

    private final String databaseUrl;
    private final String databaseUsername;
    private final String databasePassword;
    private final String pgDumpPath;

    public BackupController(
            @Value("${spring.datasource.url}") String databaseUrl,
            @Value("${spring.datasource.username}") String databaseUsername,
            @Value("${spring.datasource.password}") String databasePassword,
            @Value("${app.backup.pg-dump-path:pg_dump}") String pgDumpPath) {
        this.databaseUrl = databaseUrl;
        this.databaseUsername = databaseUsername;
        this.databasePassword = databasePassword;
        this.pgDumpPath = pgDumpPath;
    }

    @GetMapping("/api/backup")
    public ResponseEntity<byte[]> downloadBackup() {
        try {
            DatabaseConnection connection = DatabaseConnection.fromJdbcUrl(databaseUrl);
            List<String> command = new ArrayList<>(List.of(
                    pgDumpPath,
                    "--host", connection.host(),
                    "--port", connection.port(),
                    "--username", databaseUsername,
                    "--dbname", connection.database(),
                    "--format=plain",
                    "--no-owner",
                    "--no-privileges"));

            ProcessBuilder processBuilder = new ProcessBuilder(command)
                    .redirectErrorStream(true);
            processBuilder.environment().put("PGPASSWORD", databasePassword);
            Process process = processBuilder.start();
            byte[] output = process.getInputStream().readAllBytes();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/sql"));
            headers.setContentDispositionFormData("attachment", "backup_BD_BOSQUEJO_" + timestamp + ".sql");
            headers.setContentLength(output.length);
            return new ResponseEntity<>(output, headers, HttpStatus.OK);
        } catch (IOException | InterruptedException | IllegalArgumentException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private record DatabaseConnection(String host, String port, String database) {
        private static DatabaseConnection fromJdbcUrl(String jdbcUrl) {
            String value = jdbcUrl.replaceFirst("^jdbc:postgresql://", "");
            String[] serverAndDatabase = value.split("/", 2);
            if (serverAndDatabase.length != 2 || serverAndDatabase[1].isBlank()) {
                throw new IllegalArgumentException("La URL de PostgreSQL no es válida");
            }

            String[] hostAndPort = serverAndDatabase[0].split(":", 2);
            String host = hostAndPort[0];
            String port = hostAndPort.length == 2 ? hostAndPort[1] : "5432";
            String database = serverAndDatabase[1].split("\\?", 2)[0];
            if (host.isBlank() || port.isBlank() || database.isBlank()) {
                throw new IllegalArgumentException("La URL de PostgreSQL no es válida");
            }
            return new DatabaseConnection(host, port, database);
        }
    }
}