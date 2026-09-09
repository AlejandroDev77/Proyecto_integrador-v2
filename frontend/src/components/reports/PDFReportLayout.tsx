import React, { ReactNode } from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// ─────────────────────────────────────────────
// ESTILOS BASE CORPORATIVOS
// ─────────────────────────────────────────────
export const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 80,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
  },

  // ── Cabecera ──
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: "#1a1a1a",
    marginBottom: 4,
  },
  headerBarThin: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#999999",
    marginBottom: 18,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 100, // Ancho máximo
    height: 45, // Alto fijo
    objectFit: "contain", // Previene la deformación
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  companySlogan: {
    fontSize: 7,
    color: "#666666",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  docTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  docNumber: {
    fontSize: 7,
    color: "#666666",
    marginTop: 2,
  },

  // ── Ficha técnica ──
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  infoBlock: {
    width: "48%",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1a1a1a",
    width: 90,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 8,
    color: "#333333",
    flex: 1,
  },

  // ── Métricas ──
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#333333",
    padding: 8,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    color: "#666666",
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  // ── Tabla ──
  tableTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    color: "#1a1a1a",
    marginBottom: 6,
  },
  table: {
    width: "100%",
  },
  thRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
    backgroundColor: "#eeeeee",
  },
  thCell: {
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.2,
    color: "#1a1a1a",
    padding: 5,
  },
  tdRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
  },
  tdRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    backgroundColor: "#f7f7f7",
  },
  tdCell: {
    fontSize: 8,
    color: "#333333",
    padding: 5,
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1a1a1a",
    backgroundColor: "#eeeeee",
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#1a1a1a",
    padding: 5,
  },
  totalValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1a1a1a",
    padding: 5,
    textAlign: "right",
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
  },
  footerLine: {
    borderTopWidth: 0.5,
    borderTopColor: "#999999",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#666666",
  },
  footerBold: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#333333",
  },
});

// ─────────────────────────────────────────────
// COMPONENTE REUTILIZABLE
// ─────────────────────────────────────────────
interface PDFReportLayoutProps {
  title: string;
  codigoReporte: string;
  autor: string;
  fechaInicio: string;
  fechaFin: string;
  metricas: { label: string; value: string }[];
  children: ReactNode;
}

export default function PDFReportLayout({
  title,
  codigoReporte,
  autor,
  fechaInicio,
  fechaFin,
  metricas,
  children,
}: PDFReportLayoutProps) {
  const fechaGeneracion = new Date();

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* ═══════ CABECERA (se repite en cada página) ═══════ */}
        <View style={pdfStyles.headerBar} fixed>
          <View style={pdfStyles.logoRow}>
            <Image src="/images/logo/BOSQUEJO_PROT_2-mini.png" style={pdfStyles.logo} />
            <View>
              <Text style={pdfStyles.companyName}>Bosquejo</Text>
              <Text style={pdfStyles.companySlogan}>Muebles de Diseño · Taller & Showroom</Text>
            </View>
          </View>
          <View style={pdfStyles.headerRight}>
            <Text style={pdfStyles.docTitle}>{title}</Text>
            <Text style={pdfStyles.docNumber}>{codigoReporte}</Text>
          </View>
        </View>
        <View style={pdfStyles.headerBarThin} fixed />

        {/* ═══════ FICHA TÉCNICA ═══════ */}
        <View style={pdfStyles.infoGrid}>
          <View style={pdfStyles.infoBlock}>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>Fecha Inicio:</Text>
              <Text style={pdfStyles.infoValue}>{fechaInicio}</Text>
            </View>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>Fecha Fin:</Text>
              <Text style={pdfStyles.infoValue}>{fechaFin}</Text>
            </View>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>Generado por:</Text>
              <Text style={pdfStyles.infoValue}>{autor}</Text>
            </View>
          </View>
          <View style={pdfStyles.infoBlock}>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>Fecha Emisión:</Text>
              <Text style={pdfStyles.infoValue}>
                {fechaGeneracion.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
              </Text>
            </View>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>Hora:</Text>
              <Text style={pdfStyles.infoValue}>
                {fechaGeneracion.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.infoLabel}>N° Documento:</Text>
              <Text style={pdfStyles.infoValue}>{codigoReporte}</Text>
            </View>
          </View>
        </View>

        {/* ═══════ MÉTRICAS ═══════ */}
        <View style={pdfStyles.metricsRow}>
          {metricas.map((m, i) => (
            <View style={pdfStyles.metricBox} key={i}>
              <Text style={pdfStyles.metricLabel}>{m.label}</Text>
              <Text style={pdfStyles.metricValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* ═══════ CONTENIDO DINÁMICO ═══════ */}
        {children}

        {/* ═══════ FOOTER (se repite en cada página) ═══════ */}
        <View style={pdfStyles.footer} fixed>
          <View style={pdfStyles.footerLine}>
            <Text style={pdfStyles.footerText}>Bosquejo · Muebles de Diseño</Text>
            <Text style={pdfStyles.footerBold}>{codigoReporte}</Text>
            <Text
              style={pdfStyles.footerText}
              render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
