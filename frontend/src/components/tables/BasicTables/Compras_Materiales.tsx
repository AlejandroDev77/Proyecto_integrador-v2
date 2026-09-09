import { useState } from "react";
import { useComprasMateriales } from "../../../hooks/compras_materiales/useComprasMateriales";
import ModalAgregarCompraMaterial from "../../ui/modal/compra_material/AgregarModal";
import ModalEditarCompraMaterial from "../../ui/modal/compra_material/EditarModal";
import ModalVerCompraMaterial from "../../ui/modal/compra_material/VerDatos";
import CompraMaterialesAdvancedFilters from "../../filters/CompraMaterialesAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShoppingCart, ChevronLeft, ChevronRight, User, Calendar, Tag } from "lucide-react";
import Badge from "../../ui/badge/Badge";

export default function ComprasMateriales() {
  const {
    setComprasMateriales,
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
  } = useComprasMateriales();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [compramaterialSeleccionado, setCompraMaterialSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_comp: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta compra?");
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
      const res = await fetch(`http://localhost:8080/api/compras-materiales/${id_comp}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar compra");

      setComprasMateriales((prev) => prev.filter((comp) => (comp.id_comp || (comp as any).id) !== id_comp));
    } catch (error) {
      console.error("Error al eliminar compra:", error);
      alert("No se pudo eliminar la compra.");
    }
  };

  return (
    <div className="space-y-4">
      <CompraMaterialesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ShoppingCart size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Compras de Materiales</p>
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
          Nueva compra
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",    field: "cod_comp" },
                  { label: "Detalles",  field: null },
                  { label: "Proveedor", field: "proveedor.nom_prov" },
                  { label: "Total",     field: "total_comp" },
                  { label: "Estado",    field: "est_comp" },
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
                      <ShoppingCart size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin compras</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron compras con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((compra, idx) => {
                    const fecha = new Date(compra.fec_comp);
                    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
                    const fechaStr = fecha.toLocaleDateString("es-ES", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                    });

                    return (
                      <motion.tr
                        key={compra.id_comp || compra.id || idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {compra.cod_comp || "—"}
                          </span>
                        </td>

                        {/* Detalles (Fecha + Empleado) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="font-medium text-gray-800 dark:text-gray-200">{fechaStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <User size={12} className="text-gray-400" />
                              <span>{compra.empleado?.nom_emp || "Sin empleado"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Proveedor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <Tag size={12} />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {compra.proveedor?.nom_prov || "Sin proveedor"}
                            </span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                            Bs. {compra.total_comp}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          <Badge
                            size="sm"
                            color={
                              compra.est_comp === "Completado"
                                ? "success"
                                : compra.est_comp === "Cancelado"
                                ? "error"
                                : "warning"
                            }
                          >
                            {compra.est_comp}
                          </Badge>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setCompraMaterialSeleccionado(compra); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setCompraMaterialSeleccionado(compra); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(compra.id_comp || (compra as any).id),
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
      <ModalAgregarCompraMaterial
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setComprasMateriales={setComprasMateriales}
      />
      <ModalEditarCompraMaterial
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        compramaterialSeleccionado={compramaterialSeleccionado}
        setComprasMateriales={setComprasMateriales}
      />
      <ModalVerCompraMaterial
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        compramaterialSeleccionado={compramaterialSeleccionado}
      />
    </div>
  );
}
