package com.changuitostudio.backend.shared;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Locale;
import java.util.Set;

public final class UploadValidator {
    private static final long MAX_IMAGE = 10L * 1024 * 1024;
    private static final long MAX_DOCUMENT = 20L * 1024 * 1024;
    private UploadValidator() {}

    public static void image(MultipartFile file) { validate(file, MAX_IMAGE, Set.of("jpg", "jpeg", "png", "webp"), Kind.IMAGE); }
    public static void model(MultipartFile file) { validate(file, MAX_DOCUMENT, Set.of("glb"), Kind.GLB); }
    public static void evidence(MultipartFile file) { validate(file, MAX_DOCUMENT, Set.of("jpg", "jpeg", "png", "webp", "pdf"), Kind.EVIDENCE); }

    private static void validate(MultipartFile file, long max, Set<String> extensions, Kind kind) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("El archivo está vacío.");
        if (file.getSize() > max) throw new IllegalArgumentException("El archivo excede el tamaño permitido.");
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String ext = name.contains(".") ? name.substring(name.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT) : "";
        if (!extensions.contains(ext)) throw new IllegalArgumentException("Tipo de archivo no permitido.");
        try {
            byte[] h = file.getInputStream().readNBytes(12);
            boolean jpeg = h.length >= 3 && (h[0] & 0xff) == 0xff && (h[1] & 0xff) == 0xd8 && (h[2] & 0xff) == 0xff;
            boolean png = h.length >= 8 && h[0] == (byte) 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G';
            boolean webp = h.length >= 12 && ascii(h, 0, "RIFF") && ascii(h, 8, "WEBP");
            boolean pdf = h.length >= 5 && ascii(h, 0, "%PDF-");
            boolean glb = h.length >= 4 && ascii(h, 0, "glTF");
            boolean valid = switch (kind) {
                case IMAGE -> jpeg || png || webp;
                case EVIDENCE -> jpeg || png || webp || pdf;
                case GLB -> glb;
            };
            if (!valid) throw new IllegalArgumentException("El contenido del archivo no coincide con un formato permitido.");
        } catch (IOException e) {
            throw new IllegalArgumentException("No se pudo validar el archivo.");
        }
    }

    private static boolean ascii(byte[] data, int offset, String expected) {
        if (data.length < offset + expected.length()) return false;
        for (int i = 0; i < expected.length(); i++) if (data[offset + i] != (byte) expected.charAt(i)) return false;
        return true;
    }
    private enum Kind { IMAGE, EVIDENCE, GLB }
}
