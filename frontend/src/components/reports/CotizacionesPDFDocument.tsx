import React from "react";
import { Text, View } from "@react-pdf/renderer";
import PDFReportLayout, { pdfStyles as s } from "./PDFReportLayout";

export default function CotizacionesPDFDocument({ cotizaciones, fechaInicio, fechaFin, autor }: any) {
  const cotizacionesAceptadas = cotizaciones.filter((c: any) => c.est_cot === "Aprobado").length;
  const cotizacionesRechazadas = cotizaciones.filter((c: any) => c.est_cot === "Cancelado").length;
  const totalCotizado = cotizaciones.reduce((acc: number, c: any) => acc + (Number(c.total_cot) || 0), 0);
  const totalAceptado = cotizaciones.filter((c: any) => c.est_cot === "Aprobado").reduce((acc: number, c: any) => acc + (Number(c.total_cot) || 0), 0);
  const codigoReporte = `RPT-COT-${new Date().toISOString().slice(0,10).replace(/-/g,"")}`;

  return (
    <PDFReportLayout
      title="Reporte de Cotizaciones"
      codigoReporte={codigoReporte}
      autor={autor}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      metricas={[
        { label: "Total Cotizaciones", value: String(cotizaciones.length) },
        { label: "Aprobadas", value: String(cotizacionesAceptadas) },
        { label: "Canceladas", value: String(cotizacionesRechazadas) },
        { label: "Monto Aprobado (Bs)", value: totalAceptado.toFixed(2) },
      ]}
    >
      <Text style={s.tableTitle}>Registro de Cotizaciones Emitidas</Text>
      <View style={s.table}>
        {/* Encabezado */}
        <View style={s.thRow} fixed>
          <Text style={[s.thCell, { width: "6%" }]}>N°</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Código</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Fecha Emisión</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Validez (Días)</Text>
          <Text style={[s.thCell, { width: "26%" }]}>Cliente</Text>
          <Text style={[s.thCell, { width: "12%" }]}>Estado</Text>
          <Text style={[s.thCell, { width: "14%", textAlign: "right" }]}>Total (Bs)</Text>
        </View>
        {/* Filas */}
        {cotizaciones.map((cot: any, index: number) => (
          <View style={index % 2 === 0 ? s.tdRow : s.tdRowAlt} key={cot.id_cot || index} wrap={false}>
            <Text style={[s.tdCell, { width: "6%" }]}>{index + 1}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{cot.cod_cot || "S/C"}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{cot.fec_cot}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{cot.val_cot || 0} días</Text>
            <Text style={[s.tdCell, { width: "26%" }]}>{cot.cliente?.nom_cli || "Consumidor"} {cot.cliente?.ap_pat_cli || ""}</Text>
            <Text style={[s.tdCell, { width: "12%" }]}>{cot.est_cot}</Text>
            <Text style={[s.tdCell, { width: "14%", textAlign: "right", fontWeight: "bold" }]}>
              {(Number(cot.total_cot) || 0).toFixed(2)}
            </Text>
          </View>
        ))}
        {/* Fila de totales */}
        <View style={s.totalRow} wrap={false}>
          <Text style={[s.totalLabel, { width: "86%" }]}>MONTO TOTAL COTIZADO</Text>
          <Text style={[s.totalValue, { width: "14%" }]}>
            Bs. {totalCotizado.toFixed(2)}
          </Text>
        </View>
      </View>
    </PDFReportLayout>
  );
}
