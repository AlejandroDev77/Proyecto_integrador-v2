package com.changuitostudio.backend.infrastructure.service.report;

import com.changuitostudio.backend.application.dto.dashboard.DashboardResponse;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReportService {

    public byte[] generateUsuariosPdf(java.util.List<com.changuitostudio.backend.domain.model.Usuario> usuarios) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Título
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte de Usuarios Registrados", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Subtítulo con fecha
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Paragraph subtitle = new Paragraph("Generado el: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")), subTitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(30);
            document.add(subtitle);

            // Tabla de usuarios
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 3f, 4f, 2f, 2f});
            table.setSpacingBefore(10f);
            table.setSpacingAfter(20f);

            // Encabezados
            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            String[] headers = {"ID", "Usuario", "Email", "Rol", "Estado"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headFont));
                cell.setPadding(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(new java.awt.Color(230, 230, 230));
                table.addCell(cell);
            }

            // Datos
            Font rowFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            for (com.changuitostudio.backend.domain.model.Usuario u : usuarios) {
                PdfPCell cId = new PdfPCell(new Phrase(u.getIdUsu() != null ? String.valueOf(u.getIdUsu()) : "N/A", rowFont));
                cId.setPadding(8); cId.setHorizontalAlignment(Element.ALIGN_CENTER); table.addCell(cId);

                PdfPCell cNom = new PdfPCell(new Phrase(u.getNomUsu() != null ? u.getNomUsu() : "N/A", rowFont));
                cNom.setPadding(8); table.addCell(cNom);

                PdfPCell cEmail = new PdfPCell(new Phrase(u.getEmailUsu() != null ? u.getEmailUsu() : "N/A", rowFont));
                cEmail.setPadding(8); table.addCell(cEmail);

                String roleName = (u.getNomRol() != null) ? u.getNomRol() : "Usuario";
                PdfPCell cRol = new PdfPCell(new Phrase(roleName, rowFont));
                cRol.setPadding(8); cRol.setHorizontalAlignment(Element.ALIGN_CENTER); table.addCell(cRol);

                String estado = (u.getEstUsu() != null && u.getEstUsu()) ? "Activo" : "Inactivo";
                PdfPCell cEst = new PdfPCell(new Phrase(estado, rowFont));
                cEst.setPadding(8); cEst.setHorizontalAlignment(Element.ALIGN_CENTER); table.addCell(cEst);
            }

            document.add(table);
            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    public byte[] generateDashboardPdf(DashboardResponse data, Integer year, Integer month) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Título
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte Ejecutivo de Operaciones", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Subtítulo con fecha
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            String period = (month != null ? "Mes: " + month + " | " : "") + "Año: " + year;
            Paragraph subtitle = new Paragraph("Período analizado: " + period + "\nGenerado el: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")), subTitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(30);
            document.add(subtitle);

            // Sección: Métricas Clave
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Paragraph metricsTitle = new Paragraph("1. Metricas Clave", sectionFont);
            metricsTitle.setSpacingAfter(10);
            document.add(metricsTitle);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(20f);

            addCellToTable(table, "Total de Clientes", String.valueOf(data.getMetrics().getCustomers().getTotal()));
            addCellToTable(table, "Total de Empleados", String.valueOf(data.getMetrics().getEmployees().getTotal()));
            addCellToTable(table, "Ventas del Mes", "$" + data.getMetrics().getVentasDelMes());
            addCellToTable(table, "Ventas del Periodo", "$" + data.getMetrics().getVentasDelPeriodo());
            addCellToTable(table, "Cotizaciones Pendientes", String.valueOf(data.getMetrics().getCotizacionesPendientes()));
            addCellToTable(table, "Producciones Activas", String.valueOf(data.getMetrics().getProduccionesActivas()));

            document.add(table);

            // Sección: Alertas de Inventario
            Paragraph alertsTitle = new Paragraph("2. Alertas de Inventario", sectionFont);
            alertsTitle.setSpacingAfter(10);
            document.add(alertsTitle);

            if (data.getMetrics().getStockBajo() != null && data.getMetrics().getStockBajo() > 0) {
                com.lowagie.text.List alertList = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
                
                if (data.getAlertas_stock() != null) {
                    if (data.getAlertas_stock().getMateriales() != null) {
                        for (DashboardResponse.MaterialAlertaDto m : data.getAlertas_stock().getMateriales()) {
                            alertList.add(new ListItem("Material: " + m.getNombre() + " - Stock actual: " + m.getStock() + " " + m.getUnidad_medida()));
                        }
                    }
                    if (data.getAlertas_stock().getMuebles() != null) {
                        for (DashboardResponse.MuebleAlertaDto m : data.getAlertas_stock().getMuebles()) {
                            alertList.add(new ListItem("Mueble: " + m.getNombre() + " - Stock actual: " + m.getStock()));
                        }
                    }
                }
                document.add(alertList);
            } else {
                document.add(new Paragraph("No hay alertas criticas de stock en este periodo.", subTitleFont));
            }

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    private void addCellToTable(PdfPTable table, String name, String value) {
        Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        PdfPCell c1 = new PdfPCell(new Phrase(name, headFont));
        c1.setPadding(8);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value != null && !value.equals("null") ? value : "0"));
        c2.setPadding(8);
        table.addCell(c2);
    }
}
