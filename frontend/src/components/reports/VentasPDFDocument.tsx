import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { Venta } from "../../../types/venta";
import PDFReportLayout, { pdfStyles as s } from "./PDFReportLayout";

interface VentasPDFDocumentProps {
  ventas: Venta[];
  fechaInicio: string;
  fechaFin: string;
  autor: string;
}

export default function VentasPDFDocument({ ventas, fechaInicio, fechaFin, autor }: VentasPDFDocumentProps) {
  const totalIngresos = ventas.reduce((acc, v) => acc + (Number(v.total_ven) || 0), 0);
  const totalDescuentos = ventas.reduce((acc, v) => acc + (Number(v.descuento) || 0), 0);
  const ventasCompletadas = ventas.filter(v => v.est_ven === "Completado").length;
  const ventasPendientes = ventas.filter(v => v.est_ven === "Pendiente").length;
  const codigoReporte = `RPT-VEN-${new Date().toISOString().slice(0,10).replace(/-/g,"")}`;

  return (
    <PDFReportLayout
      title="Reporte de Ventas"
      codigoReporte={codigoReporte}
      autor={autor}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      metricas={[
        { label: "Total Ventas", value: String(ventas.length) },
        { label: "Completadas", value: String(ventasCompletadas) },
        { label: "Pendientes", value: String(ventasPendientes) },
        { label: "Ingresos (Bs)", value: totalIngresos.toFixed(2) },
      ]}
    >
      {/* Título de la tabla */}
      <Text style={s.tableTitle}>Detalle de Transacciones</Text>

      <View style={s.table}>
        {/* Encabezado */}
        <View style={s.thRow} fixed>
          <Text style={[s.thCell, { width: "6%" }]}>N°</Text>
          <Text style={[s.thCell, { width: "12%" }]}>Código</Text>
          <Text style={[s.thCell, { width: "12%" }]}>Fecha</Text>
          <Text style={[s.thCell, { width: "28%" }]}>Cliente</Text>
          <Text style={[s.thCell, { width: "12%" }]}>Estado</Text>
          <Text style={[s.thCell, { width: "15%", textAlign: "right" }]}>Descuento</Text>
          <Text style={[s.thCell, { width: "15%", textAlign: "right" }]}>Total (Bs)</Text>
        </View>

        {/* Filas */}
        {ventas.map((venta, index) => (
          <View
            style={index % 2 === 0 ? s.tdRow : s.tdRowAlt}
            key={venta.id_ven || (venta as any).id}
            wrap={false}
          >
            <Text style={[s.tdCell, { width: "6%" }]}>{index + 1}</Text>
            <Text style={[s.tdCell, { width: "12%" }]}>{venta.cod_ven || "S/C"}</Text>
            <Text style={[s.tdCell, { width: "12%" }]}>{venta.fec_ven}</Text>
            <Text style={[s.tdCell, { width: "28%" }]}>
              {venta.cliente?.nom_cli || "Consumidor"} {venta.cliente?.ap_pat_cli || "Final"}
            </Text>
            <Text style={[s.tdCell, { width: "12%" }]}>{venta.est_ven}</Text>
            <Text style={[s.tdCell, { width: "15%", textAlign: "right" }]}>
              {(Number(venta.descuento) || 0).toFixed(2)}
            </Text>
            <Text style={[s.tdCell, { width: "15%", textAlign: "right", fontWeight: "bold" }]}>
              {(Number(venta.total_ven) || 0).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Fila de totales */}
        <View style={s.totalRow} wrap={false}>
          <Text style={[s.totalLabel, { width: "70%" }]}>TOTAL GENERAL</Text>
          <Text style={[s.totalValue, { width: "15%" }]}>
            {totalDescuentos.toFixed(2)}
          </Text>
          <Text style={[s.totalValue, { width: "15%" }]}>
            Bs. {totalIngresos.toFixed(2)}
          </Text>
        </View>
      </View>
    </PDFReportLayout>
  );
}
