import React from "react";
import { Text, View } from "@react-pdf/renderer";
import PDFReportLayout, { pdfStyles as s } from "./PDFReportLayout";

export default function ProduccionesPDFDocument({ producciones, fechaInicio, fechaFin, autor }: any) {
  const produccionesEnProceso = producciones.filter((p: any) => p.est_pro === "En Proceso" || p.est_pro === "En Fabricacion" || p.est_pro === "Iniciado").length;
  const produccionesTerminadas = producciones.filter((p: any) => p.est_pro === "Completado" || p.est_pro === "Terminado").length;
  const codigoReporte = `RPT-PROD-${new Date().toISOString().slice(0,10).replace(/-/g,"")}`;

  return (
    <PDFReportLayout
      title="Reporte de Producción"
      codigoReporte={codigoReporte}
      autor={autor}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      metricas={[
        { label: "Total Producciones", value: String(producciones.length) },
        { label: "En Proceso", value: String(produccionesEnProceso) },
        { label: "Completadas", value: String(produccionesTerminadas) },
      ]}
    >
      <Text style={s.tableTitle}>Detalle de Órdenes de Producción</Text>
      <View style={s.table}>
        {/* Encabezado */}
        <View style={s.thRow} fixed>
          <Text style={[s.thCell, { width: "6%" }]}>N°</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Código</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Fecha Inicio</Text>
          <Text style={[s.thCell, { width: "14%" }]}>Fecha Fin</Text>
          <Text style={[s.thCell, { width: "26%" }]}>Cotización Asoc.</Text>
          <Text style={[s.thCell, { width: "12%" }]}>Estado</Text>
          <Text style={[s.thCell, { width: "14%", textAlign: "right" }]}>Prioridad</Text>
        </View>
        {/* Filas */}
        {producciones.map((prod: any, index: number) => (
          <View style={index % 2 === 0 ? s.tdRow : s.tdRowAlt} key={prod.id_pro || index} wrap={false}>
            <Text style={[s.tdCell, { width: "6%" }]}>{index + 1}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{prod.cod_pro || "S/C"}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{prod.fec_ini || "-"}</Text>
            <Text style={[s.tdCell, { width: "14%" }]}>{prod.fec_fin || "-"}</Text>
            <Text style={[s.tdCell, { width: "26%" }]}>{prod.cotizacion?.cod_cot || "-"}</Text>
            <Text style={[s.tdCell, { width: "12%" }]}>{prod.est_pro || "-"}</Text>
            <Text style={[s.tdCell, { width: "14%", textAlign: "right", fontWeight: "bold" }]}>
              {prod.prioridad || "-"}
            </Text>
          </View>
        ))}
        {/* Fila de totales */}
        <View style={s.totalRow} wrap={false}>
          <Text style={[s.totalLabel, { width: "86%" }]}>COSTO TOTAL ESTIMADO</Text>
          <Text style={[s.totalValue, { width: "14%" }]}>
            Bs. {costoTotalEstimado.toFixed(2)}
          </Text>
        </View>
      </View>
    </PDFReportLayout>
  );
}
