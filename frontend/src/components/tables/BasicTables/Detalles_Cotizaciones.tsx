import { useState } from "react";
import { useDetallesCotizaciones } from "../../../hooks/detalles_cotizaciones/useDetalles_Cotizaciones";
import DetalleCotizacionAdvancedFilters from "../../filters/DetalleCotizacionAdvancedFilters";
import ModalAgregarDetalleCotizacion from "../../ui/modal/detalle_cotizacion/AgregarModal";
import ModalEditarDetalleCotizacion from "../../ui/modal/detalle_cotizacion/EditarModal";
import ModalVerDetalleCotizacion from "../../ui/modal/detalle_cotizacion/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ClipboardList, ChevronLeft, ChevronRight, Palette, Layers, Box, Calendar } from "lucide-react";
import Badge from "../../ui/badge/Badge";

export default function DetallesCotizaciones() {
  const {
    setDetallesCotizaciones,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    totalPages,
    setFilters,
  } = useDetallesCotizaciones();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [detallecotizacionSeleccionado, setDetalleCotizacionSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);

  const handleEliminar = async (id_det_cot: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este detalle de cotización?");
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
      const res = await fetch(`http://localhost:8080/api/detalle-cotizacion/${id_det_cot}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar detalle de cotización");

      setDetallesCotizaciones((prev) => prev.filter((det) => det.id_det_cot !== id_det_cot));
    } catch (error) {
      console.error("Error al eliminar detalle de cotización:", error);
      alert("No se pudo eliminar el detalle de cotización.");
    }
  };

  return (
    <div className="space-y-4">
      <DetalleCotizacionAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ClipboardList size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Detalles de Cotización</p>
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
                {[
                  "Código",
                  "Mueble",
                  "Características",
                  "Cotización",
                  "Precios",
                  "Acciones",
                ].map((label) => (
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
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <ClipboardList size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin detalles</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron detalles con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((det, idx) => {
                    const fechaCot = det.cotizacion?.fec_cot
                      ? new Date(det.cotizacion.fec_cot).toLocaleDateString("es-ES", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                        })
                      : "—";

                    return (
                      <motion.tr
                        key={det.id_det_cot}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {det.cod_det_cot || "—"}
                          </span>
                        </td>

                        {/* Mueble (Nombre + Tipo + Dimensiones) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-medium text-gray-900 dark:text-white leading-tight">
                              {det.nombre_mueble || det.mueble?.nombre || "—"}
                            </span>
                            <div className="flex items-center gap-2 text-[11px]">
                              {det.tipo_mueble && (
                                <span className="capitalize bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-medium">
                                  {det.tipo_mueble}
                                </span>
                              )}
                              {det.dimensiones && (
                                <span className="text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded">
                                  {det.dimensiones}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Características (Material + Color + Herrajes) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1 text-[11px] text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1.5">
                              <Layers size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px]">{det.material_principal || "Sin material"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Palette size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px]">{det.color_acabado || "Sin color"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Box size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px] text-gray-400">{det.herrajes || "Sin herrajes"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Cotización (Fecha + Estado) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                              <Calendar size={12} className="text-gray-400" />
                              <span>{fechaCot}</span>
                            </div>
                            <Badge
                              size="sm"
                              color={
                                det.cotizacion?.est_cot === "Aprobado"
                                  ? "success"
                                  : det.cotizacion?.est_cot === "Rechazado"
                                  ? "error"
                                  : "warning"
                              }
                            >
                              {det.cotizacion?.est_cot ?? "Pendiente"}
                            </Badge>
                          </div>
                        </td>

                        {/* Precios (Unitario x Cantidad = Subtotal) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="text-[11px] text-gray-500">
                              Bs. {det.precio_unitario} × {det.cantidad} u.
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400">Subtotal:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                Bs. {det.subtotal}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setDetalleCotizacionSeleccionado(det); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setDetalleCotizacionSeleccionado(det); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(det.id_det_cot),
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
      <ModalAgregarDetalleCotizacion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDetallesCotizaciones={setDetallesCotizaciones}
      />
      <ModalEditarDetalleCotizacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        detallecotizacionSeleccionado={detallecotizacionSeleccionado}
        setDetallesCotizaciones={setDetallesCotizaciones}
      />
      <ModalVerDetalleCotizacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        detallecotizacionSeleccionado={detallecotizacionSeleccionado}
      />
    </div>
  );
}
