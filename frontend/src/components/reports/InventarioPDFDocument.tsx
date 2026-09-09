import React from "react";
import { Text, View } from "@react-pdf/renderer";
import PDFReportLayout, { pdfStyles as s } from "./PDFReportLayout";

export default function InventarioPDFDocument({ movimientos, fechaInicio, fechaFin, autor }: any) {
  const totalEntradas = movimientos.filter((m: any) => String(m.tipo_mov).toUpperCase() === "ENTRADA").length;
  const totalSalidas = movimientos.filter((m: any) => String(m.tipo_mov).toUpperCase() === "SALIDA").length;
  
  // Calcular el material con más movimientos
  const conteoMateriales: Record<string, number> = {};
  movimientos.forEach((m: any) => {
    const mat = m.material?.nom_mat || m.mueble?.nom_mue || "Sin Ítem";
    conteoMateriales[mat] = (conteoMateriales[mat] || 0) + 1;
  });
  const materialMasMovido = Object.entries(conteoMateriales).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const codigoReporte = `RPT-INV-${new Date().toISOString().slice(0,10).replace(/-/g,"")}`;

  return (
    <PDFReportLayout
      title="Reporte de Movimientos de Inventario"
      codigoReporte={codigoReporte}
      autor={autor}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      metricas={[
        { label: "Total Movimientos", value: String(movimientos.length) },
        { label: "Entradas", value: String(totalEntradas) },
        { label: "Salidas", value: String(totalSalidas) },
        { label: "Mat. Más Movido", value: materialMasMovido },
      ]}
    >
      <Text style={s.tableTitle}>Kardex de Movimientos</Text>
      <View style={s.table}>
        {/* Encabezado */}
        <View style={s.thRow} fixed>
          <Text style={[s.thCell, { width: "6%" }]}>N°</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Fecha</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Tipo</Text>
          <Text style={[s.thCell, { width: "32%" }]}>Ítem (Material/Mueble)</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Cantidad</Text>
          <Text style={[s.thCell, { width: "20%" }]}>Motivo / Referencia</Text>
        </View>
        {/* Filas */}
        {movimientos.map((mov: any, index: number) => (
          <View style={index % 2 === 0 ? s.tdRow : s.tdRowAlt} key={mov.id_mov || index} wrap={false}>
            <Text style={[s.tdCell, { width: "6%" }]}>{index + 1}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{mov.fecha_mov}</Text>
            <Text style={[s.tdCell, { width: "14%", fontWeight: "bold", color: String(mov.tipo_mov).toUpperCase() === "ENTRADA" ? "#16a34a" : "#ea580c" }]}>
              {mov.tipo_mov}
            </Text>
            <Text style={[s.tdCell, { width: "32%" }]}>{mov.material?.nom_mat || mov.mueble?.nom_mue || "Sin Ítem"}</Text>
            <Text style={[s.tdCell, { width: "14%", fontWeight: "bold" }]}>{mov.cantidad}</Text>
            <Text style={[s.tdCell, { width: "20%" }]}>{mov.motivo || "-"}</Text>
          </View>
        ))}
      </View>
    </PDFReportLayout>
  );
}
