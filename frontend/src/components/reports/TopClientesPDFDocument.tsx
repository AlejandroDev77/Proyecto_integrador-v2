import React from "react";
import { Text, View } from "@react-pdf/renderer";
import PDFReportLayout, { pdfStyles as s } from "./PDFReportLayout";

export default function TopClientesPDFDocument({ topClientes, fechaInicio, fechaFin, autor }: any) {
  const totalClientes = topClientes.length;
  const ingresosTotales = topClientes.reduce((acc: number, c: any) => acc + c.totalGastado, 0);
  const clienteEstrella = topClientes[0]?.nombre || "N/A";
  const promedioCompra = totalClientes > 0 ? (ingresosTotales / totalClientes) : 0;
  const codigoReporte = `RPT-CLI-${new Date().toISOString().slice(0,10).replace(/-/g,"")}`;

  return (
    <PDFReportLayout
      title="Reporte de Mejores Clientes"
      codigoReporte={codigoReporte}
      autor={autor}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      metricas={[
        { label: "Clientes Activos", value: String(totalClientes) },
        { label: "Cliente Estrella", value: clienteEstrella },
        { label: "Ingresos (Bs)", value: ingresosTotales.toFixed(2) },
        { label: "Promedio de Compra (Bs)", value: promedioCompra.toFixed(2) },
      ]}
    >
      <Text style={s.tableTitle}>Ranking de Clientes por Volumen de Compra</Text>
      <View style={s.table}>
        {/* Encabezado */}
        <View style={s.thRow} fixed>
          <Text style={[s.thCell, { width: "10%" }]}>Puesto</Text>
          <Text style={[s.thCell, { width: "15%" }]}>CI / NIT</Text>
          <Text style={[s.thCell, { width: "35%" }]}>Cliente</Text>
          <Text style={[s.thCell, { width: "20%", textAlign: "center" }]}>Cant. Compras</Text>
          <Text style={[s.thCell, { width: "20%", textAlign: "right" }]}>Total Gastado (Bs)</Text>
        </View>
        {/* Filas */}
        {topClientes.map((cli: any, index: number) => (
          <View style={index % 2 === 0 ? s.tdRow : s.tdRowAlt} key={cli.id_cli || index} wrap={false}>
            <Text style={[s.tdCell, { width: "10%", fontWeight: "bold" }]}>#{index + 1}</Text>
            <Text style={[s.tdCell, { width: "15%" }]}>{cli.ci}</Text>
            <Text style={[s.tdCell, { width: "35%" }]}>{cli.nombre}</Text>
            <Text style={[s.tdCell, { width: "20%", textAlign: "center" }]}>{cli.cantidadVentas}</Text>
            <Text style={[s.tdCell, { width: "20%", textAlign: "right", fontWeight: "bold" }]}>
              {cli.totalGastado.toFixed(2)}
            </Text>
          </View>
        ))}
        {/* Fila de totales */}
        <View style={s.totalRow} wrap={false}>
          <Text style={[s.totalLabel, { width: "80%" }]}>TOTAL INGRESOS ESTOS CLIENTES</Text>
          <Text style={[s.totalValue, { width: "20%" }]}>
            Bs. {ingresosTotales.toFixed(2)}
          </Text>
        </View>
      </View>
    </PDFReportLayout>
  );
}
