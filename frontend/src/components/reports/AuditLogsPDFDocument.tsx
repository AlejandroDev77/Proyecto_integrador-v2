import React from "react";
import { Text, View } from "@react-pdf/renderer";
import PDFReportLayout, { pdfStyles as s } from "./PDFReportLayout";

export interface AuditLogPdfItem { id: number; cod_usu?: string; table_name?: string; action: string; record_id?: number; old_values?: string | null; new_values?: string | null; created_at?: string; }
interface AuditLogsPDFDocumentProps { logs: AuditLogPdfItem[]; fechaInicio: string; fechaFin: string; autor: string; }
type Values = Record<string, unknown>;
const actionStyle = { INSERT: { color: "#15803d", backgroundColor: "#dcfce7" }, UPDATE: { color: "#a16207", backgroundColor: "#fef3c7" }, DELETE: { color: "#b91c1c", backgroundColor: "#fee2e2" } };

function parse(value?: string | null): Values { try { return value ? JSON.parse(value) : {}; } catch { return {}; } }
function formatDate(value?: string) { return value ? new Date(value).toLocaleString("es-BO") : "Sin fecha"; }
function compact(value: unknown) { const text = value === null || value === undefined ? "-" : typeof value === "object" ? JSON.stringify(value) : String(value); return text.length > 48 ? `${text.slice(0, 45)}...` : text; }
function changedKeys(before: Values, after: Values) { return Object.keys({ ...before, ...after }).filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key])); }

function ChangeDetail({ log }: { log: AuditLogPdfItem }) {
  const before = parse(log.old_values); const after = parse(log.new_values); const keys = changedKeys(before, after).slice(0, 3);
  if (log.action === "INSERT") return <Text style={{ color: "#15803d", fontSize: 7 }}>CREADO: {Object.keys(after).length ? Object.keys(after).slice(0, 5).join(", ") : "Sin valores registrados"}</Text>;
  if (log.action === "DELETE") return <Text style={{ color: "#b91c1c", fontSize: 7 }}>ELIMINADO: {Object.keys(before).length ? Object.keys(before).slice(0, 5).join(", ") : "Sin valores registrados"}</Text>;
  if (!keys.length) return <Text style={{ color: "#a16207", fontSize: 7 }}>ACTUALIZADO: Sin valores registrados</Text>;
  return <View>{keys.map((key) => <Text key={key} style={{ fontSize: 6.5, marginBottom: 2 }}><Text style={{ color: "#b91c1c" }}>Antes: {compact(before[key])}</Text><Text style={{ color: "#a16207" }}>  {key} actualizado  </Text><Text style={{ color: "#15803d" }}>Después: {compact(after[key])}</Text></Text>)}</View>;
}

export default function AuditLogsPDFDocument({ logs, fechaInicio, fechaFin, autor }: AuditLogsPDFDocumentProps) {
  const code = `RPT-AUD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
  return <PDFReportLayout title="Reporte de Auditoría" codigoReporte={code} autor={autor} fechaInicio={fechaInicio} fechaFin={fechaFin} metricas={[{ label: "Total eventos", value: String(logs.length) }, { label: "Creaciones", value: String(logs.filter((log) => log.action === "INSERT").length) }, { label: "Actualizaciones", value: String(logs.filter((log) => log.action === "UPDATE").length) }, { label: "Eliminaciones", value: String(logs.filter((log) => log.action === "DELETE").length) }]}>
    <Text style={s.tableTitle}>Detalle de eventos registrados</Text><View style={s.table}><View style={s.thRow} fixed><Text style={[s.thCell, { width: "16%" }]}>Fecha</Text><Text style={[s.thCell, { width: "13%" }]}>Usuario</Text><Text style={[s.thCell, { width: "13%" }]}>Acción</Text><Text style={[s.thCell, { width: "17%" }]}>Tabla / ID</Text><Text style={[s.thCell, { width: "41%" }]}>Comparación de cambios</Text></View>{logs.map((log, index) => <View key={log.id} wrap={false} style={index % 2 === 0 ? s.tdRow : s.tdRowAlt}><Text style={[s.tdCell, { width: "16%" }]}>{formatDate(log.created_at)}</Text><Text style={[s.tdCell, { width: "13%" }]}>{log.cod_usu || "SISTEMA"}</Text><View style={[s.tdCell, { width: "13%", padding: 3 }]}><Text style={{ fontSize: 7, fontWeight: "bold", padding: 3, textAlign: "center", ...(actionStyle[log.action as keyof typeof actionStyle] || actionStyle.UPDATE) }}>{log.action}</Text></View><Text style={[s.tdCell, { width: "17%" }]}>{`${log.table_name || "-"} #${log.record_id ?? "-"}`}</Text><View style={[s.tdCell, { width: "41%" }]}><ChangeDetail log={log} /></View></View>)}</View>
  </PDFReportLayout>;
}
