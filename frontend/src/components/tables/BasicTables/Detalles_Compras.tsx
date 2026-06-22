import { useState } from "react";
import { useDetallesCompras, DetalleCompra } from "../../../hooks/detalles_compras/useDetallesCompras";
import ModalAgregarDetalleCompra from "../../ui/modal/detalle_compra/AgregarModal";
import ModalEditarDetalleCompra from "../../ui/modal/detalle_compra/EditarModal";
import ModalVerDetalleCompra from "../../ui/modal/detalle_compra/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ListOrdered, ChevronLeft, ChevronRight, Hash, Calendar, Layers } from "lucide-react";
import SortableTableHeader from "../../ui/SortableTableHeader";
import DetallesComprasAdvancedFilters from "../../filters/DetallesComprasAdvancedFilters";

export default function DetallesCompras() {
  const {
    setDetallesCompra,
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
  } = useDetallesCompras();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [detallecompraSeleccionado, setDetalleCompraSeleccionado] = useState<DetalleCompra | null>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_det_comp: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este Detalle?");
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
      const res = await fetch(`http://localhost:8080/api/detalle-compra/${id_det_comp}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar Detalle");

      setDetallesCompra((prev) => prev.filter((det) => det.id_det_comp !== id_det_comp));
    } catch (error) {
      console.error("Error al eliminar Detalle:", error);
      alert("No se pudo eliminar el Detalle.");
    }
  };

  return (
    <div className="space-y-4">
      <DetallesComprasAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ListOrdered size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Detalles de Compras</p>
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
                  { label: "Código",   field: "cod_det_comp" },
                  { label: "Material", field: "materiales.nom_mat" },
                  { label: "Compra",   field: "compras_materiales.fec_comp" },
                  { label: "Precios",  field: "precio_unitario" },
                  { label: "Acciones", field: null },
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
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <ListOrdered size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin detalles</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron detalles con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((detalle, idx) => {
                    const fecha = detalle.compra?.fec_comp
                      ? new Date(detalle.compra.fec_comp).toLocaleDateString("es-ES", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                        })
                      : "—";

                    return (
                      <motion.tr
                        key={detalle.id_det_comp}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {detalle.cod_det_comp || "—"}
                          </span>
                        </td>

                        {/* Material */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <Layers size={12} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 dark:text-white leading-tight">
                                {detalle.material?.nom_mat || "Sin material"}
                              </span>
                              <span className="text-[10px] text-gray-500 mt-0.5">
                                Cantidad: {detalle.cantidad}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Compra (Fecha) */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            <Calendar size={12} className="text-gray-400" />
                            <span>{fecha}</span>
                          </div>
                        </td>

                        {/* Precios (Unitario y Subtotal) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400">Unit:</span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Bs. {detalle.precio_unitario}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400">Sub:</span>
                              <span className="font-bold text-gray-900 dark:text-gray-100">Bs. {detalle.subtotal}</span>
                            </div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setDetalleCompraSeleccionado(detalle); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setDetalleCompraSeleccionado(detalle); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(detalle.id_det_comp),
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
      <ModalAgregarDetalleCompra
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDetallesCompra={setDetallesCompra}
      />
      <ModalEditarDetalleCompra
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        detalleSeleccionado={detallecompraSeleccionado}
        setDetallesCompra={setDetallesCompra}
      />
      <ModalVerDetalleCompra
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        detalleSeleccionado={detallecompraSeleccionado}
      />
    </div>
  );
}
