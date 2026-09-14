import React, { useState, useEffect } from "react";
import { BarChart2, Download, FileSpreadsheet, ExternalLink, FileText, CreditCard, Database } from "lucide-react";
import ReportLayout from "./ReportLayout";
import { BlobProvider } from "@react-pdf/renderer";
import VentasPDFDocument from "../../reports/VentasPDFDocument";
import PagosPDFDocument from "../../reports/PagosPDFDocument";
import * as XLSX from "xlsx";
import Select from "../../form/Select";
import DatePicker from "../../form/date-picker";

import ProduccionesPDFDocument from "../../reports/ProduccionesPDFDocument";
import TopClientesPDFDocument from "../../reports/TopClientesPDFDocument";
import CotizacionesPDFDocument from "../../reports/CotizacionesPDFDocument";
import InventarioPDFDocument from "../../reports/InventarioPDFDocument";

type TipoReporte = "ventas" | "pagos" | "produccion" | "clientes" | "cotizaciones" | "inventario";

// interfaces removed

export default function Reportes() {
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>("ventas");
  const [fechaInicio, setFechaInicio] = useState("2026-01-01");
  const [fechaFin, setFechaFin] = useState("2026-06-30");
  const [ventas, setVentas] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [producciones, setProducciones] = useState<any[]>([]);
  const [topClientes, setTopClientes] = useState<any[]>([]);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [autor, setAutor] = useState("Administrador");
  const [datosCargados, setDatosCargados] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed?.user?.name) setAutor(parsed.user.name);
        else if (parsed?.username) setAutor(parsed.username);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Limpiar datos al cambiar de tipo
  useEffect(() => {
    setVentas([]);
    setPagos([]);
    setProducciones([]);
    setTopClientes([]);
    setCotizaciones([]);
    setMovimientos([]);
    setDatosCargados(false);
    setCurrentPage(1);
  }, [tipoReporte]);

  const fetchDatos = async () => {
    setLoading(true);
    setDatosCargados(false);
    try {
      const start = new Date(fechaInicio);
      const end = new Date(fechaFin);
      end.setHours(23, 59, 59, 999);

      if (tipoReporte === "ventas" || tipoReporte === "clientes") {
        const res = await fetch(`http://localhost:8080/api/ventas?page=1&per_page=5000`);
        const payload = await res.json();
        const items = payload?.data?.content || payload?.data || [];
        const filtradas = items.filter((v: any) => {
          if (!v.fec_ven) return false;
          const fec = new Date(v.fec_ven);
          return fec >= start && fec <= end;
        });
        
        if (tipoReporte === "ventas") {
          setVentas(filtradas);
        } else {
          // Lógica para Top Clientes
          const clientesMap: Record<string, any> = {};
          filtradas.forEach((v: any) => {
            if (v.est_ven === "Anulado") return; // No contar anuladas
            const ci = v.cliente?.ci_cli || "Sin CI";
            const nom = `${v.cliente?.nom_cli || "Consumidor"} ${v.cliente?.ap_pat_cli || "Final"}`;
            if (!clientesMap[ci]) {
              clientesMap[ci] = { ci, nombre: nom, cantidadVentas: 0, totalGastado: 0 };
            }
            clientesMap[ci].cantidadVentas += 1;
            clientesMap[ci].totalGastado += (Number(v.total_ven) || 0);
          });
          const ranking = Object.values(clientesMap).sort((a: any, b: any) => b.totalGastado - a.totalGastado);
          setTopClientes(ranking);
        }
      } else if (tipoReporte === "pagos") {
        const res = await fetch(`http://localhost:8080/api/pagos?page=1&per_page=5000`);
        const payload = await res.json();
        const items = payload?.data?.content || payload?.data || [];
        const filtrados = items.filter((p: any) => {
          if (!p.fec_pag) return false;
          const fec = new Date(p.fec_pag);
          return fec >= start && fec <= end;
        });
        setPagos(filtrados);
      } else if (tipoReporte === "produccion") {
        const res = await fetch(`http://localhost:8080/api/producciones?page=1&per_page=5000`);
        const payload = await res.json();
        const items = payload?.data?.content || payload?.data || [];
        const filtrados = items.filter((p: any) => {
          if (!p.fec_ini) return false;
          const fec = new Date(p.fec_ini);
          return fec >= start && fec <= end;
        });
        setProducciones(filtrados);
      } else if (tipoReporte === "cotizaciones") {
        const res = await fetch(`http://localhost:8080/api/cotizaciones?page=1&per_page=5000`);
        const payload = await res.json();
        const items = payload?.data?.content || payload?.data || [];
        const filtrados = items.filter((c: any) => {
          if (!c.fec_cot) return false;
          const fec = new Date(c.fec_cot);
          return fec >= start && fec <= end;
        });
        setCotizaciones(filtrados);
      } else if (tipoReporte === "inventario") {
        const res = await fetch(`http://localhost:8080/api/movimientos-inventario?page=1&per_page=5000`);
        const payload = await res.json();
        const items = payload?.data?.content || payload?.data || [];
        const filtrados = items.filter((m: any) => {
          if (!m.fecha_mov) return false;
          const fec = new Date(m.fecha_mov);
          return fec >= start && fec <= end;
        });
        setMovimientos(filtrados);
      }
      setDatosCargados(true);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error obteniendo datos para el reporte", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    let dataToExport: Record<string, any>[] = [];
    let sheetName = "";

    if (tipoReporte === "ventas") {
      dataToExport = ventas.map((v) => ({
        "Código Venta": v.cod_ven || "S/C",
        "Fecha": v.fec_ven,
        "Cliente": `${v.cliente?.nom_cli || "Consumidor"} ${v.cliente?.ap_pat_cli || "Final"}`,
        "Estado": v.est_ven,
        "Descuento (Bs)": Number(v.descuento) || 0,
        "Total (Bs)": Number(v.total_ven) || 0,
      }));
      sheetName = "Ventas";
    } else if (tipoReporte === "pagos") {
      dataToExport = pagos.map((p) => {
        const ventaAsoc = p.venta?.codVen || p.venta?.cod_ven || (p.venta?.id ? `VEN-${p.venta.id}` : (p.id_ven ? `VEN-${p.id_ven}` : "-"));
        return {
          "Código Pago": p.cod_pag || "S/C",
          "Fecha": p.fec_pag,
          "Método": p.metodo_pag,
          "Referencia": p.referencia_pag || "-",
          "Venta Asociada": ventaAsoc,
          "Monto (Bs)": Number(p.monto) || 0,
        };
      });
      sheetName = "Pagos";
    } else if (tipoReporte === "produccion") {
      dataToExport = producciones.map((p) => ({
        "Código": p.cod_pro || "S/C",
        "Fecha Inicio": p.fec_ini,
        "Fecha Fin": p.fec_fin || "Sin finalizar",
        "Cotización Asoc.": p.cotizacion?.cod_cot || "Sin Cotización",
        "Estado": p.est_pro,
        "Prioridad": p.prioridad || "-",
      }));
      sheetName = "Produccion";
    } else if (tipoReporte === "clientes") {
      dataToExport = topClientes.map((c, i) => ({
        "Ranking": i + 1,
        "CI / NIT": c.ci,
        "Nombre Cliente": c.nombre,
        "Cant. Compras": c.cantidadVentas,
        "Total Gastado (Bs)": Number(c.totalGastado) || 0,
      }));
      sheetName = "TopClientes";
    } else if (tipoReporte === "cotizaciones") {
      dataToExport = cotizaciones.map((c) => ({
        "Código": c.cod_cot || "S/C",
        "Fecha": c.fec_cot,
        "Cliente": `${c.cliente?.nom_cli || "Consumidor"} ${c.cliente?.ap_pat_cli || ""}`,
        "Estado": c.est_cot,
        "Validez (Días)": c.val_cot || 0,
        "Total (Bs)": Number(c.total_cot) || 0,
      }));
      sheetName = "Cotizaciones";
    } else if (tipoReporte === "inventario") {
      dataToExport = movimientos.map((m) => ({
        "Fecha": m.fecha_mov,
        "Tipo": m.tipo_mov,
        "Ítem": m.material?.nom_mat || m.mueble?.nom_mue || "Sin Ítem",
        "Cantidad": m.cantidad,
        "Motivo": m.motivo || "-",
      }));
      sheetName = "Kardex";
    }

    if (dataToExport.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `Reporte_${sheetName}_${fechaInicio}_a_${fechaFin}.xlsx`);
  };

  const descargarBackup = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/backup", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("No se pudo generar el backup");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup_BD_BOSQUEJO_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "_")}.sql`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el backup:", error);
    }
  };

  const datosDisponibles =
    (tipoReporte === "ventas" && ventas.length > 0) ||
    (tipoReporte === "pagos" && pagos.length > 0) ||
    (tipoReporte === "produccion" && producciones.length > 0) ||
    (tipoReporte === "clientes" && topClientes.length > 0) ||
    (tipoReporte === "cotizaciones" && cotizaciones.length > 0) ||
    (tipoReporte === "inventario" && movimientos.length > 0);

  // Documento PDF dinámico según el tipo seleccionado
  let pdfDocument;
  switch (tipoReporte) {
    case "ventas": pdfDocument = <VentasPDFDocument ventas={ventas} fechaInicio={fechaInicio} fechaFin={fechaFin} autor={autor} />; break;
    case "pagos": pdfDocument = <PagosPDFDocument pagos={pagos} fechaInicio={fechaInicio} fechaFin={fechaFin} autor={autor} />; break;
    case "produccion": pdfDocument = <ProduccionesPDFDocument producciones={producciones} fechaInicio={fechaInicio} fechaFin={fechaFin} autor={autor} />; break;
    case "clientes": pdfDocument = <TopClientesPDFDocument topClientes={topClientes} fechaInicio={fechaInicio} fechaFin={fechaFin} autor={autor} />; break;
    case "cotizaciones": pdfDocument = <CotizacionesPDFDocument cotizaciones={cotizaciones} fechaInicio={fechaInicio} fechaFin={fechaFin} autor={autor} />; break;
    case "inventario": pdfDocument = <InventarioPDFDocument movimientos={movimientos} fechaInicio={fechaInicio} fechaFin={fechaFin} autor={autor} />; break;
    default: pdfDocument = <VentasPDFDocument ventas={ventas} fechaInicio={fechaInicio} fechaFin={fechaFin} autor={autor} />;
  }

  const dataToPaginate = 
    tipoReporte === "ventas" ? ventas : 
    tipoReporte === "pagos" ? pagos :
    tipoReporte === "produccion" ? producciones :
    tipoReporte === "clientes" ? topClientes :
    tipoReporte === "cotizaciones" ? cotizaciones :
    movimientos;

  const totalPages = Math.ceil(dataToPaginate.length / itemsPerPage);
  const currentData = dataToPaginate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <ReportLayout
      title="Generador de Reportes"
      description="Selecciona el tipo de reporte, un rango de fechas y genera el documento."
      icon={<BarChart2 className="w-6 h-6 text-orange-500" />}
      filters={
        <div className="flex flex-wrap items-center gap-4">
          {/* Selector de Tipo usando el componente Select */}
          <div className="w-56">
            <Select
              options={[
                { value: "ventas", label: "📄 Reporte de Ventas" },
                { value: "pagos", label: "💳 Reporte de Pagos" },
                { value: "produccion", label: "🔨 Reporte de Producción" },
                { value: "clientes", label: "⭐ Mejores Clientes" },
                { value: "cotizaciones", label: "📝 Reporte Cotizaciones" },
                { value: "inventario", label: "📦 Kardex de Inventario" },
              ]}
              defaultValue={tipoReporte}
              onChange={(val) => setTipoReporte(val as TipoReporte)}
              className="h-10"
            />
          </div>

          {/* Fechas Rápidas */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 1);
                setFechaInicio(start.toISOString().split("T")[0]);
                setFechaFin(end.toISOString().split("T")[0]);
              }}
              className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
            >
              Último Año
            </button>
            <button
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 1);
                setFechaInicio(start.toISOString().split("T")[0]);
                setFechaFin(end.toISOString().split("T")[0]);
              }}
              className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
            >
              Último Mes
            </button>
          </div>

          {/* Rango Personalizado con DatePicker */}
          <div className="w-64">
            <DatePicker
              id="rango-fechas"
              mode="range"
              placeholder="Seleccionar Rango Personalizado"
              onChange={(selectedDates: Date[]) => {
                if (selectedDates.length === 2) {
                  // Ajustar zona horaria local
                  const start = new Date(selectedDates[0].getTime() - selectedDates[0].getTimezoneOffset() * 60000);
                  const end = new Date(selectedDates[1].getTime() - selectedDates[1].getTimezoneOffset() * 60000);
                  setFechaInicio(start.toISOString().split("T")[0]);
                  setFechaFin(end.toISOString().split("T")[0]);
                }
              }}
            />
          </div>
          
          <div className="flex items-center text-xs text-gray-400 font-medium ml-1">
            ({fechaInicio} a {fechaFin})
          </div>

          {/* Botón de Carga */}
          <button
            onClick={fetchDatos}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm ml-auto h-10"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Cargar Datos"}
          </button>

          {/* Acciones de Exportación */}
          <button
            onClick={descargarBackup}
            className="flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <Database className="w-4 h-4" /> Backup SQL
          </button>

          {datosDisponibles && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-500 font-medium text-sm rounded-lg transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel
              </button>

              <BlobProvider document={pdfDocument} key={`${tipoReporte}-${Date.now()}`}>
                {({ url, loading: pdfLoading }) => (
                  <a
                    href={url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-lg transition-colors shadow-sm ${
                      pdfLoading || !url
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                        : "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-500"
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" /> {pdfLoading ? "Preparando..." : "Ver PDF"}
                  </a>
                )}
              </BlobProvider>
            </div>
          )}
        </div>
      }
    >
      {datosCargados && datosDisponibles ? (
        <div className="space-y-6">
          {/* Métricas rápidas */}
          {tipoReporte === "ventas" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard label="Total Ventas" value={`${ventas.length}`} icon={<FileText className="w-5 h-5" />} color="blue" />
              <MetricCard label="Ingresos" value={`Bs. ${ventas.reduce((a, v) => a + (Number(v.total_ven) || 0), 0).toFixed(2)}`} icon={<BarChart2 className="w-5 h-5" />} color="emerald" />
              <MetricCard label="Descuentos" value={`Bs. ${ventas.reduce((a, v) => a + (Number(v.descuento) || 0), 0).toFixed(2)}`} icon={<Download className="w-5 h-5" />} color="orange" />
            </div>
          )}
          {tipoReporte === "pagos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard label="Total Pagos" value={`${pagos.length}`} icon={<CreditCard className="w-5 h-5" />} color="blue" />
              <MetricCard label="Recaudado" value={`Bs. ${pagos.reduce((a, p) => a + (Number(p.monto) || 0), 0).toFixed(2)}`} icon={<BarChart2 className="w-5 h-5" />} color="emerald" />
            </div>
          )}
          {tipoReporte === "produccion" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard label="En Proceso" value={`${producciones.filter(p => p.est_pro === "En Proceso" || p.est_pro === "En Fabricacion" || p.est_pro === "Iniciado").length}`} icon={<FileText className="w-5 h-5" />} color="blue" />
              <MetricCard label="Terminadas" value={`${producciones.filter(p => p.est_pro === "Completado" || p.est_pro === "Terminado").length}`} icon={<Download className="w-5 h-5" />} color="emerald" />
            </div>
          )}
          {tipoReporte === "clientes" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard label="Top 1 Cliente" value={topClientes[0]?.nombre || "-"} icon={<FileText className="w-5 h-5" />} color="blue" />
              <MetricCard label="Ingresos Totales" value={`Bs. ${topClientes.reduce((a, c) => a + c.totalGastado, 0).toFixed(2)}`} icon={<BarChart2 className="w-5 h-5" />} color="emerald" />
              <MetricCard label="Promedio Compra" value={`Bs. ${topClientes.length > 0 ? (topClientes.reduce((a, c) => a + c.totalGastado, 0) / topClientes.length).toFixed(2) : 0}`} icon={<CreditCard className="w-5 h-5" />} color="orange" />
            </div>
          )}
          {tipoReporte === "cotizaciones" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard label="Aprobadas" value={`${cotizaciones.filter(c => c.est_cot === "Aprobado").length}`} icon={<Download className="w-5 h-5" />} color="emerald" />
              <MetricCard label="Canceladas" value={`${cotizaciones.filter(c => c.est_cot === "Cancelado").length}`} icon={<FileText className="w-5 h-5" />} color="orange" />
              <MetricCard label="Total Cotizado" value={`Bs. ${cotizaciones.reduce((a, c) => a + (Number(c.total_cot) || 0), 0).toFixed(2)}`} icon={<BarChart2 className="w-5 h-5" />} color="blue" />
            </div>
          )}
          {tipoReporte === "inventario" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard label="Entradas" value={`${movimientos.filter(m => String(m.tipo_mov).toUpperCase() === "ENTRADA").length}`} icon={<Download className="w-5 h-5" />} color="emerald" />
              <MetricCard label="Salidas" value={`${movimientos.filter(m => String(m.tipo_mov).toUpperCase() === "SALIDA").length}`} icon={<FileText className="w-5 h-5" />} color="orange" />
            </div>
          )}

          {/* Tabla de Datos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white capitalize">
                Vista Previa — {tipoReporte.replace("produccion", "producción")}
              </h3>
            </div>
            <div className="overflow-x-auto">
              {tipoReporte === "ventas" ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-5 py-3">N°</th>
                      <th className="px-5 py-3">Código</th>
                      <th className="px-5 py-3">Fecha</th>
                      <th className="px-5 py-3">Cliente</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3 text-right">Descuento</th>
                      <th className="px-5 py-3 text-right">Total (Bs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.map((venta: any, i: number) => (
                      <tr key={venta.id_ven || (venta as any).id || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-3 text-gray-500">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{venta.cod_ven || "S/C"}</td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{venta.fec_ven}</td>
                        <td className="px-5 py-3 text-gray-800 dark:text-gray-200">
                          {venta.cliente?.nom_cli || "Consumidor"} {venta.cliente?.ap_pat_cli || "Final"}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            venta.est_ven === "Completado"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}>
                            {venta.est_ven}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-gray-500">{(Number(venta.descuento) || 0).toFixed(2)}</td>
                        <td className="px-5 py-3 text-right font-bold text-gray-800 dark:text-white">
                          {(Number(venta.total_ven) || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : tipoReporte === "pagos" ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-5 py-3">N°</th>
                      <th className="px-5 py-3">Código</th>
                      <th className="px-5 py-3">Fecha</th>
                      <th className="px-5 py-3">Método</th>
                      <th className="px-5 py-3">Referencia</th>
                      <th className="px-5 py-3">Venta Asoc.</th>
                      <th className="px-5 py-3 text-right">Monto (Bs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.map((pago: any, i: number) => (
                      <tr key={pago.id_pag || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-3 text-gray-500">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{pago.cod_pag || "S/C"}</td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{pago.fec_pag}</td>
                        <td className="px-5 py-3 text-gray-800 dark:text-gray-200">{pago.metodo_pag}</td>
                        <td className="px-5 py-3 text-gray-500">{pago.referencia_pag || "-"}</td>
                        <td className="px-5 py-3 text-gray-800 dark:text-gray-200">
                          {pago.venta?.codVen || pago.venta?.cod_ven || (pago.venta?.id ? `VEN-${pago.venta.id}` : (pago.id_ven ? `VEN-${pago.id_ven}` : "-"))}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-gray-800 dark:text-white">
                          {(Number(pago.monto) || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : tipoReporte === "produccion" ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-5 py-3">Código</th>
                      <th className="px-5 py-3">F. Inicio</th>
                      <th className="px-5 py-3">F. Fin</th>
                      <th className="px-5 py-3">Cotización</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3 text-right">Prioridad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.map((p: any, i: number) => (
                      <tr key={p.id_pro || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{p.cod_pro}</td>
                        <td className="px-5 py-3 text-gray-500">{p.fec_ini || "-"}</td>
                        <td className="px-5 py-3 text-gray-500">{p.fec_fin || "-"}</td>
                        <td className="px-5 py-3 text-gray-800 dark:text-gray-200">{p.cotizacion?.cod_cot || "-"}</td>
                        <td className="px-5 py-3">{p.est_pro || "-"}</td>
                        <td className="px-5 py-3 text-right font-bold">{p.prioridad || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : tipoReporte === "clientes" ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-5 py-3">Ranking</th>
                      <th className="px-5 py-3">CI/NIT</th>
                      <th className="px-5 py-3">Nombre</th>
                      <th className="px-5 py-3 text-center">Compras</th>
                      <th className="px-5 py-3 text-right">Total Gastado (Bs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.map((c: any, i: number) => (
                      <tr key={c.ci || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-5 py-3 font-bold text-gray-800 dark:text-gray-200">#{(currentPage - 1) * itemsPerPage + i + 1}</td>
                        <td className="px-5 py-3 text-gray-500">{c.ci}</td>
                        <td className="px-5 py-3 text-gray-800 dark:text-gray-200">{c.nombre}</td>
                        <td className="px-5 py-3 text-center">{c.cantidadVentas}</td>
                        <td className="px-5 py-3 text-right font-bold text-emerald-600">{c.totalGastado.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : tipoReporte === "cotizaciones" ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-5 py-3">Código</th>
                      <th className="px-5 py-3">Fecha</th>
                      <th className="px-5 py-3">Cliente</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3 text-right">Total (Bs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.map((c: any, i: number) => (
                      <tr key={c.id_cot || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{c.cod_cot}</td>
                        <td className="px-5 py-3 text-gray-500">{c.fec_cot}</td>
                        <td className="px-5 py-3 text-gray-800 dark:text-gray-200">{c.cliente?.nom_cli}</td>
                        <td className="px-5 py-3">{c.est_cot}</td>
                        <td className="px-5 py-3 text-right font-bold">{(Number(c.total_cot) || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-5 py-3">Fecha</th>
                      <th className="px-5 py-3">Tipo</th>
                      <th className="px-5 py-3">Ítem (Material/Mueble)</th>
                      <th className="px-5 py-3">Cant.</th>
                      <th className="px-5 py-3">Motivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentData.map((m: any, i: number) => (
                      <tr key={m.id_mov || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-5 py-3 text-gray-500">{m.fecha_mov}</td>
                        <td className={`px-5 py-3 font-bold ${String(m.tipo_mov).toUpperCase() === "ENTRADA" ? "text-green-600" : "text-orange-600"}`}>{m.tipo_mov}</td>
                        <td className="px-5 py-3 text-gray-800 dark:text-gray-200">{m.material?.nom_mat || m.mueble?.nom_mue || "Sin Ítem"}</td>
                        <td className="px-5 py-3 font-bold">{m.cantidad}</td>
                        <td className="px-5 py-3 text-gray-500">{m.motivo || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Controles de Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : datosCargados && !datosDisponibles ? (
        <div className="p-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron registros en el rango de fechas seleccionado.
          </p>
        </div>
      ) : (
        <div className="p-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Selecciona el tipo de reporte, un rango de fechas y presiona "Cargar Datos".
          </p>
        </div>
      )}
    </ReportLayout>
  );
}

// ─── Componente de Tarjeta de Métrica ───
function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-500",
  };
  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{value}</h3>
      </div>
      <div className={`w-11 h-11 rounded-full ${colorMap[color] || colorMap.blue} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}
