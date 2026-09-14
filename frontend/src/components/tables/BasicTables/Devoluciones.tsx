import { useState } from "react";
import { useDevoluciones } from "../../../hooks/devoluciones/useDevoluciones";
import DevolucionesAdvancedFilters from "../../filters/DevolucionesAdvancedFilters";
import ModalAgregarDevolucion from "../../ui/modal/devolucion/AgregarModal";
import ModalEditarDevolucion from "../../ui/modal/devolucion/EditarModal";
import ModalVerDevolucion from "../../ui/modal/devolucion/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Undo2, ChevronLeft, ChevronRight, Calendar, User, ShoppingBag } from "lucide-react";
import Badge from "../../ui/badge/Badge";

export default function Devolucion() {
  const {
    setDevoluciones,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    totalPages,
    setFilters,
  } = useDevoluciones();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [devolucionSeleccionado, setDevolucionSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);

  const handleEliminar = async (id_dev: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta devolución?");
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
      const res = await fetch(`http://localhost:8080/api/devolucion/${id_dev}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar devolución");

      setDevoluciones((prev) => prev.filter((dev) => dev.id_dev !== id_dev));
    } catch (error) {
      console.error("Error al eliminar devolución:", error);
      alert("No se pudo eliminar la devolución.");
    }
  };

  return (
    <div className="space-y-4">
      <DevolucionesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Undo2 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Devoluciones</p>
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
          Nueva devolución
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {["Código", "Motivo y Total", "Venta Original", "Estado", "Acciones"].map((label) => (
                  <th
                    key={label}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/4">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Undo2 size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin devoluciones</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron registros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((dev, idx) => {
                    const fechaDev = dev.fec_dev
                      ? new Date(dev.fec_dev).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "—";
                    const fechaVen = dev.venta?.fec_ven
                      ? new Date(dev.venta.fec_ven).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "—";

                    return (
                      <motion.tr
                        key={dev.id_dev}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                              {dev.cod_dev || "—"}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <Calendar size={12} className="text-orange-400" />
                              <span>{fechaDev}</span>
                            </div>
                          </div>
                        </td>

                        {/* Motivo y Total */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              Bs. {dev.total_dev || "0.00"}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 italic max-w-[200px] truncate" title={dev.motivo_dev}>
                              "{dev.motivo_dev || "Sin motivo especificado"}"
                            </span>
                          </div>
                        </td>

                        {/* Venta Original */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1.5">
                              <ShoppingBag size={12} className="text-indigo-400" />
                              <span>Venta: {fechaVen}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User size={12} className="text-gray-400 shrink-0" />
                              <span className="truncate max-w-[150px]">
                                {dev.empleado ? `${dev.empleado.nom_emp} ${dev.empleado.ap_pat_emp}` : "Sin empleado"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          <Badge
                            size="sm"
                            color={
                              dev.est_dev === "Completado"
                                ? "success"
                                : dev.est_dev === "Cancelado"
                                ? "error"
                                : "warning"
                            }
                          >
                            {dev.est_dev || "Pendiente"}
                          </Badge>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setDevolucionSeleccionado(dev); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setDevolucionSeleccionado(dev); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(dev.id_dev),
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
      <ModalAgregarDevolucion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDevoluciones={setDevoluciones}
      />
      <ModalEditarDevolucion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        devolucionSeleccionado={devolucionSeleccionado}
        setDevoluciones={setDevoluciones}
      />
      <ModalVerDevolucion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        devolucionSeleccionado={devolucionSeleccionado}
      />
    </div>
  );
}
