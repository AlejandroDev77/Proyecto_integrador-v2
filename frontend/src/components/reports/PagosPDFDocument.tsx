import React from "react";
import { Text, View } from "@react-pdf/renderer";
import PDFReportLayout, { pdfStyles as s } from "./PDFReportLayout";

interface Pago {
  id_pag: number;
  cod_pag?: string;
  monto: number;
  fec_pag: string;
  metodo_pag: string;
  referencia_pag: string;
  id_ven: number;
  venta?: {
    est_ven: string;
    total_ven: number;
  };
}

interface PagosPDFDocumentProps {
  pagos: Pago[];
  fechaInicio: string;
  fechaFin: string;
  autor: string;
}

export default function PagosPDFDocument({ pagos, fechaInicio, fechaFin, autor }: PagosPDFDocumentProps) {
  const totalRecaudado = pagos.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const metodoConteo: Record<string, number> = {};
  pagos.forEach(p => {
    const m = p.metodo_pag || "Otro";
    metodoConteo[m] = (metodoConteo[m] || 0) + 1;
  });
  const metodoMasUsado = Object.entries(metodoConteo).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const codigoReporte = `RPT-PAG-${new Date().toISOString().slice(0,10).replace(/-/g,"")}`;

  return (
    <PDFReportLayout
      title="Reporte de Pagos"
      codigoReporte={codigoReporte}
      autor={autor}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      metricas={[
        { label: "Total Pagos", value: String(pagos.length) },
        { label: "Recaudado (Bs)", value: totalRecaudado.toFixed(2) },
        { label: "Método Frecuente", value: metodoMasUsado },
      ]}
    >
      <Text style={s.tableTitle}>Detalle de Pagos Registrados</Text>

      <View style={s.table}>
        {/* Encabezado */}
        <View style={s.thRow} fixed>
          <Text style={[s.thCell, { width: "6%" }]}>N°</Text>
          <Text style={[s.thCell, { width: "12%" }]}>Código</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Fecha</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Método</Text>
          <Text style={[s.thCell, { width: "20%" }]}>Referencia</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Venta Asoc.</Text>
          <Text style={[s.thCell, { width: "20%", textAlign: "right" }]}>Monto (Bs)</Text>
        </View>

        {/* Filas */}
        {pagos.map((pago, index) => (
          <View
            style={index % 2 === 0 ? s.tdRow : s.tdRowAlt}
            key={pago.id_pag || index}
            wrap={false}
          >
            <Text style={[s.tdCell, { width: "6%" }]}>{index + 1}</Text>
            <Text style={[s.tdCell, { width: "12%" }]}>{pago.cod_pag || "S/C"}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{pago.fec_pag}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{pago.metodo_pag}</Text>
            <Text style={[s.tdCell, { width: "20%" }]}>{pago.referencia_pag || "-"}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>
              {pago.venta?.codVen || pago.venta?.cod_ven || (pago.venta?.id ? `VEN-${pago.venta.id}` : (pago.id_ven ? `VEN-${pago.id_ven}` : "-"))}
            </Text>
            <Text style={[s.tdCell, { width: "20%", textAlign: "right", fontWeight: "bold" }]}>
              {(Number(pago.monto) || 0).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Fila de totales */}
        <View style={s.totalRow} wrap={false}>
          <Text style={[s.totalLabel, { width: "80%" }]}>TOTAL RECAUDADO</Text>
          <Text style={[s.totalValue, { width: "20%" }]}>
            Bs. {totalRecaudado.toFixed(2)}
          </Text>
        </View>
      </View>
    </PDFReportLayout>
  );
}
