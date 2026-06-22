import { useState } from "react";
import { useDetallesProducciones, DetalleProduccion } from "../../../hooks/detalles_producciones/useDetalles_Producciones";
import DetallesProduccionAdvancedFilters from "../../filters/DetallesProduccionAdvancedFilters";
import ModalAgregarDetalleProduccion from "../../ui/modal/detalle_produccion/AgregarModal";
import ModalEditarDetalleProduccion from "../../ui/modal/detalle_produccion/EditarModal";
import ModalVerDetalleProduccion from "../../ui/modal/detalle_produccion/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ListTree, ChevronLeft, ChevronRight, Armchair, Calendar } from "lucide-react";
import Badge from "../../ui/badge/Badge";

export default function DetallesDevoluciones() {
  const {
    setDetallesProducciones,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    totalPages,
    setFilters,
  } = useDetallesProducciones();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [detalleproduccionSeleccionado, setDetalleProduccionSeleccionado] = useState<DetalleProduccion | null>(null);
  const [showModalVer, setShowModalVer] = useState(false);

  const handleEliminar = async (id_det_pro: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este detalle de producción?");
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
      const res = await fetch(`http://localhost:8080/api/detalle-produccion/${id_det_pro}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar detalle de producción");

      setDetallesProducciones((prev) => prev.filter((dpro) => dpro.id_det_pro !== id_det_pro));
    } catch (error) {
      console.error("Error al eliminar detalle de producción:", error);
      alert("No se pudo eliminar el detalle de producción.");
    }
  };

  return (
    <div className="space-y-4">
      <DetallesProduccionAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ListTree size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Detalles de Producción</p>
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
          Nuevo detalle
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {["Código", "Mueble a Producir", "Estado", "Producción (Padre)", "Acciones"].map((label) => (
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
                      <ListTree size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin detalles</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron detalles con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((dpro, idx) => {
                    const formatDate = (dateString?: string) => {
                      if (!dateString) return "—";
                      const date = new Date(dateString);
                      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                      return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
                    };

                    return (
                      <motion.tr
                        key={dpro.id_det_pro}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {dpro.cod_det_pro || "—"}
                          </span>
                        </td>

                        {/* Mueble */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <Armchair size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 dark:text-white leading-tight">
                                {dpro.mueble?.nombre || "Sin mueble"}
                              </span>
                              <span className="text-[11px] text-gray-500 mt-0.5">
                                Cantidad: <strong className="text-gray-700 dark:text-gray-300">{dpro.cantidad} u.</strong>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          <Badge
                            size="sm"
                            color={
                              dpro.est_det_pro === "Completado"
                                ? "success"
                                : dpro.est_det_pro === "Cancelado"
                                ? "error"
                                : "warning"
                            }
                          >
                            {dpro.est_det_pro || "Pendiente"}
                          </Badge>
                        </td>

                        {/* Producción (Padre) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            <span className="font-mono bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded w-fit text-[10px]">
                              Ord. Padre
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-gray-400" />
                              <span>{formatDate(dpro.produccion?.fec_ini)} - {formatDate(dpro.produccion?.fec_fin)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setDetalleProduccionSeleccionado(dpro); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setDetalleProduccionSeleccionado(dpro); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(dpro.id_det_pro),
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
      <ModalAgregarDetalleProduccion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDetallesProducciones={setDetallesProducciones}
      />
      <ModalEditarDetalleProduccion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        detalleproduccionSeleccionado={detalleproduccionSeleccionado}
        setDetallesProducciones={setDetallesProducciones}
      />
      <ModalVerDetalleProduccion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        detalleproduccionSeleccionado={detalleproduccionSeleccionado}
      />
    </div>
  );
}
