package com.changuitostudio.backend.shared;

import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

/** Reduce el peso de imágenes antes de enviarlas al almacenamiento remoto. */
public final class ImageUploadOptimizer {
    private static final int MAX_DIMENSION = 1600;
    private static final float JPEG_QUALITY = 0.82f;

    private ImageUploadOptimizer() {}

    public record OptimizedUpload(byte[] bytes, String contentType, String extension) {}

    public static OptimizedUpload optimize(MultipartFile file) throws IOException {
        byte[] original = file.getBytes();
        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String extension = extensionOf(originalName);
        String contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();

        if (!contentType.startsWith("image/") || "webp".equals(extension)) {
            return new OptimizedUpload(original, contentType, extension);
        }

        BufferedImage source = ImageIO.read(file.getInputStream());
        if (source == null) return new OptimizedUpload(original, contentType, extension);

        BufferedImage scaled = scale(source);
        boolean jpeg = "jpg".equals(extension) || "jpeg".equals(extension);
        byte[] optimized = jpeg ? writeJpeg(scaled) : writePng(scaled);

        // No sustituir un archivo si la optimización no consigue reducirlo.
        if (optimized.length >= original.length) {
            return new OptimizedUpload(original, contentType, extension);
        }
        return new OptimizedUpload(optimized, jpeg ? "image/jpeg" : "image/png", jpeg ? "jpg" : "png");
    }

    private static BufferedImage scale(BufferedImage source) {
        int width = source.getWidth();
        int height = source.getHeight();
        double ratio = Math.min(1d, (double) MAX_DIMENSION / Math.max(width, height));
        int targetWidth = Math.max(1, (int) Math.round(width * ratio));
        int targetHeight = Math.max(1, (int) Math.round(height * ratio));
        int type = source.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
        BufferedImage target = new BufferedImage(targetWidth, targetHeight, type);
        Graphics2D graphics = target.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics.drawImage(source, 0, 0, targetWidth, targetHeight, null);
        graphics.dispose();
        return target;
    }

    private static byte[] writeJpeg(BufferedImage image) throws IOException {
        BufferedImage rgb = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = rgb.createGraphics();
        graphics.setComposite(AlphaComposite.SrcOver);
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, rgb.getWidth(), rgb.getHeight());
        graphics.drawImage(image, 0, 0, null);
        graphics.dispose();

        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        if (!writers.hasNext()) throw new IOException("No hay codificador JPEG disponible");
        ImageWriter writer = writers.next();
        try (ByteArrayOutputStream output = new ByteArrayOutputStream();
             ImageOutputStream stream = ImageIO.createImageOutputStream(output)) {
            writer.setOutput(stream);
            ImageWriteParam params = writer.getDefaultWriteParam();
            params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            params.setCompressionQuality(JPEG_QUALITY);
            writer.write(null, new IIOImage(rgb, null, null), params);
            return output.toByteArray();
        } finally {
            writer.dispose();
        }
    }

    private static byte[] writePng(BufferedImage image) throws IOException {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            if (!ImageIO.write(image, "png", output)) throw new IOException("No hay codificador PNG disponible");
            return output.toByteArray();
        }
    }

    private static String extensionOf(String name) {
        int separator = name.lastIndexOf('.');
        return separator >= 0 ? name.substring(separator + 1).toLowerCase() : "";
    }
}
