import { useState } from "react";
import { useMovimientosInventarios } from "../../../hooks/movimientos_inventarios/useMovimientos_Inventarios";
import MovimientosInventarioAdvancedFilters from "../../filters/MovimientosInventarioAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import ModalAgregarMovimientoInventario from "../../ui/modal/movimiento_inventario/AgregarModal";
import ModalEditarMovimientoInventario from "../../ui/modal/movimiento_inventario/EditarModal";
import ModalVerMovimientoInventario from "../../ui/modal/movimiento_inventario/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Activity, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, Calendar, User } from "lucide-react";

export default function MovimientosInventarios() {
  const {
    setMovimietosInventarios,
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
  } = useMovimientosInventarios();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_mov: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este movimiento?");
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
      const res = await fetch(`http://localhost:8080/api/movimientos-inventario/${id_mov}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar movimiento");

      setMovimietosInventarios((prev) => prev.filter((mov) => (mov.id_mov || (mov as any).id) !== id_mov));
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
      alert("No se pudo eliminar el movimiento.");
    }
  };

  return (
    <div className="space-y-4">
      <MovimientosInventarioAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Movimientos de Inventario</p>
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
          Nuevo movimiento
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",    field: "cod_mov" },
                  { label: "Detalles",  field: "fecha_mov" },
                  { label: "Ítem",      field: null },
                  { label: "Movimiento",field: "tipo_mov" },
                  { label: "Stock",     field: null },
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
                      <Activity size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin movimientos</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron movimientos con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((mov, idx) => {
                    const fecha = mov.fecha_mov
                      ? new Date(mov.fecha_mov).toLocaleDateString("es-ES", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                        })
                      : "—";

                    const isEntrada = mov.tipo_mov === "Entrada";

                    return (
                      <motion.tr
                        key={mov.id_mov || (mov as any).id || idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {mov.cod_mov || "—"}
                          </span>
                        </td>

                        {/* Detalles (Fecha + Empleado + Motivo) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="font-medium text-gray-800 dark:text-gray-200">{fecha}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <User size={12} className="text-gray-400 shrink-0" />
                              <span className="truncate max-w-[120px]">
                                {mov.empleado ? `${mov.empleado.nom_emp} ${mov.empleado.ap_pat_emp}` : "—"}
                              </span>
                            </div>
                            {mov.motivo && (
                              <p className="text-[10px] text-gray-400 italic max-w-[150px] truncate" title={mov.motivo}>
                                {mov.motivo}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Ítem (Material o Mueble) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            {mov.material?.nom_mat ? (
                              <>
                                <span className="font-medium text-gray-900 dark:text-white leading-tight">
                                  {mov.material.nom_mat}
                                </span>
                                <span className="text-[10px] uppercase font-semibold text-gray-400">Material</span>
                              </>
                            ) : mov.mueble?.nombre ? (
                              <>
                                <span className="font-medium text-gray-900 dark:text-white leading-tight">
                                  {mov.mueble.nombre}
                                </span>
                                <span className="text-[10px] uppercase font-semibold text-gray-400">Mueble</span>
                              </>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                        </td>

                        {/* Movimiento (Entrada/Salida + Cantidad) */}
                        <td className="px-5 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isEntrada
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                          }`}>
                            {isEntrada ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                            <span>{isEntrada ? "+" : "-"}{mov.cantidad}</span>
                          </div>
                        </td>

                        {/* Stock (Anterior -> Posterior) */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                            <span className="text-gray-400">{mov.stock_anterior}</span>
                            <span className="text-gray-300 dark:text-gray-600">→</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{mov.stock_posterior}</span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setMovimientoSeleccionado(mov); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setMovimientoSeleccionado(mov); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(mov.id_mov || (mov as any).id),
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
      <ModalAgregarMovimientoInventario
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setMovimientosInventarios={setMovimietosInventarios}
      />
      <ModalEditarMovimientoInventario
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        movimientoSeleccionado={movimientoSeleccionado}
        setMovimientosInventarios={setMovimietosInventarios}
      />
      <ModalVerMovimientoInventario
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        movimientoSeleccionado={movimientoSeleccionado}
      />
    </div>
  );
}
