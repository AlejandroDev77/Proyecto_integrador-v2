import { useState } from "react";
import { useVentas } from "../../../hooks/ventas/useVentas";
import VentasAdvancedFilters from "../../filters/VentasAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShoppingBag, ChevronLeft, ChevronRight, FileText, User, Briefcase, Calendar } from "lucide-react";
import ModalAgregarVenta from "../../ui/modal/venta/AgregarModal";
import ModalEditarVenta from "../../ui/modal/venta/EditarModal";
import ModalVerVenta from "../../ui/modal/venta/VerDatos";
import Badge from "../../ui/badge/Badge";

export default function Ventas() {
  const {
    setVentas,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    totalPages,
    setFilters,
    setSort,
  } = useVentas();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [ventaSeleccionado, setVentaSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_ven: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta Venta?");
    if (!confirm) return;
    let idUsuarioLocal = null;
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "null");
      idUsuarioLocal = userObj && userObj.id_usu ? userObj.id_usu : null;
    } catch (e) {
      idUsuarioLocal = null;
    }

    const headers = {
      "Content-Type": "application/json",
      ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
    };

    try {
      const res = await fetch(`http://localhost:8080/api/ventas/${id_ven}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar Venta");

      setVentas((prev) => prev.filter((c) => (c.id_ven || (c as any).id) !== id_ven));
    } catch (error) {
      console.error("Error al eliminar Venta:", error);
      alert("No se pudo eliminar la Venta.");
    }
  };

  const generarReporte = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reporte-ventas`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al generar el reporte");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte-ventas.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    }
  };

  return (
    <div className="space-y-4">
      <VentasAdvancedFilters onFiltersChange={setFilters} />

      {/* Botón de Reporte */}
      <div className="flex justify-end px-1">
        <button
          onClick={generarReporte}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
        >
          <FileText size={14} /> Reporte PDF
        </button>
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Ventas Realizadas</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {paginatedData.length} registro{paginatedData.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModalAgregar(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          Nueva venta
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",    field: "cod_ven" },
                  { label: "Fecha",     field: "fec_ven" },
                  { label: "Importes",  field: "total_ven" },
                  { label: "Involucrados", field: null },
                  { label: "Estado",    field: "est_ven" },
                  { label: "Acciones",  field: null },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    {field ? (
                      <SortableTableHeader
                        label={label}
                        sortField={field}
                        currentSort={currentSort}
                        onSort={handleSort}
                      />
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/4">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <ShoppingBag size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin ventas</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron ventas con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((venta, idx) => {
                    const fechaStr = new Date(venta.fec_ven).toLocaleDateString("es-ES", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                    });

                    return (
                      <motion.tr
                        key={venta.id_ven || (venta as any).id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {venta.cod_ven || "—"}
                          </span>
                        </td>

                        {/* Fecha */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{fechaStr}</span>
                          </div>
                        </td>

                        {/* Importes (Total + Descuento) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              Bs. {venta.total_ven}
                            </span>
                            {Number(venta.descuento) > 0 && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded w-fit">
                                - Bs. {venta.descuento} desc.
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Involucrados (Cliente + Empleado) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs">
                              <User size={12} className="text-indigo-400 shrink-0" />
                              <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                                {venta.cliente ? `${venta.cliente.nom_cli} ${venta.cliente.ap_pat_cli}` : "—"}
                                <span className="text-gray-400 font-normal ml-1">({venta.cliente?.ci_cli})</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                              <Briefcase size={12} className="shrink-0" />
                              <span className="truncate max-w-[150px]">
                                {venta.empleado ? `${venta.empleado.nom_emp} ${venta.empleado.ap_pat_emp || ''}` : "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          <Badge
                            size="sm"
                            color={
                              venta.est_ven === "Completado"
                                ? "success"
                                : venta.est_ven === "Cancelado"
                                ? "error"
                                : "warning"
                            }
                          >
                            {venta.est_ven}
                          </Badge>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setVentaSeleccionado(venta); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setVentaSeleccionado(venta); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(venta.id_ven || (venta as any).id),
                              },
                            ]}
                          />
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer paginación */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-100 dark:border-white/6 bg-gray-50/50 dark:bg-white/[0.01]">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Página {currentPage} de {totalPages}</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            >
              <option value={5}>5 / pág</option>
              <option value={10}>10 / pág</option>
              <option value={20}>20 / pág</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <span className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalAgregarVenta
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setVentas={setVentas}
      />
      <ModalEditarVenta
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        ventaSeleccionada={ventaSeleccionado}
        setVentas={setVentas}
      />
      <ModalVerVenta
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        ventaSeleccionada={ventaSeleccionado}
      />
    </div>
  );
}
