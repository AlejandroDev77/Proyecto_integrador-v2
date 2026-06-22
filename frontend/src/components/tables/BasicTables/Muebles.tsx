import { useState } from "react";
import { useMuebles } from "../../../hooks/muebles/useMuebles";
import MueblesAdvancedFilters from "../../filters/MueblesAdvancedFilters";
import ModalAgregarMueble from "../../ui/modal/mueble/AgregarModal";
import ModalEditarMueble from "../../ui/modal/mueble/EditarModal";
import ModalVerMueble from "../../ui/modal/mueble/VerDatos";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Armchair, ChevronLeft, ChevronRight, Image as ImageIcon, Box } from "lucide-react";
import { Mueble } from "../../ui/modal/mueble/AgregarModal";

export default function Muebles() {
  const {
    setMuebles,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    showModalEstado,
    abrirModalEstado,
    confirmarCambioEstado,
    loadingCambioEstado,
    setShowModalEstado,
    paginatedData,
    totalPages,
    setFilters,
    setSort,
  } = useMuebles();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [muebleSeleccionado, setMuebleSeleccionado] = useState<Mueble | null>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_mue: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este mueble?");
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
      const res = await fetch(`http://localhost:8080/api/mueble/${id_mue}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar mueble");

      setMuebles((prev) => prev.filter((mue) => mue.id_mue !== id_mue));
    } catch (error) {
      console.error("Error al eliminar mueble:", error);
      alert("No se pudo eliminar el mueble.");
    }
  };

  return (
    <div className="space-y-4">
      <MueblesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Armchair size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Catálogo de Muebles</p>
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
          Nuevo mueble
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Mueble",       field: "nom_mue"      },
                  { label: "Categoría",    field: null           },
                  { label: "Stock",        field: "stock"        },
                  { label: "Precios",      field: null           },
                  { label: "Imagen",       field: null           },
                  { label: "Vista 3D",     field: null           },
                  { label: "Acciones",     field: null           },
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
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Armchair size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin muebles</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron muebles con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((mueble, idx) => (
                    <motion.tr
                      key={mueble.id_mue}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Mueble (Nombre + Codigo + Desc) */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white leading-tight">
                              {mueble.nom_mue}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                              {mueble.cod_mue || "S/N"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[180px] truncate">
                            {mueble.desc_mue || "Sin descripción"}
                          </span>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {mueble.categoria && mueble.categoria.nom_cat ? mueble.categoria.nom_cat : "Sin categoría"}
                        </span>
                      </td>

                      {/* Stock (con visualización de stock_min) */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-semibold ${
                            mueble.stock <= mueble.stock_min
                              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          }`}>
                            {mueble.stock} en stock
                          </span>
                          <span className="text-[10px] text-gray-400 ml-1">Mínimo: {mueble.stock_min}</span>
                        </div>
                      </td>

                      {/* Precios (Venta y Costo) */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
                            Bs. {mueble.precio_venta} <span className="text-[10px] font-normal text-gray-400">Venta</span>
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Bs. {mueble.precio_costo} <span className="text-[10px] font-normal opacity-70">Costo</span>
                          </span>
                        </div>
                      </td>

                      {/* Imagen */}
                      <td className="px-5 py-4">
                        {mueble.img_mue ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-white">
                            <img src={mueble.img_mue} alt="Mueble" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-white/5">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>

                      {/* Vista 3D */}
                      <td className="px-5 py-4">
                        {mueble.modelo_3d ? (
                          <a
                            href={mueble.modelo_3d}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 transition-colors"
                            title="Ver Modelo 3D"
                          >
                            <Box size={16} />
                          </a>
                        ) : (
                          <span className="text-gray-400/50 flex items-center justify-center w-8 h-8"><Box size={16} /></span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setMuebleSeleccionado(mueble); setShowModalVer(true); },
                            },
                            {
                              type: "toggle",
                              onClick: () => abrirModalEstado(mueble.id_mue, mueble.est_mue),
                              isActive: mueble.est_mue,
                              activeLabel: "No Disponible",
                              inactiveLabel: "Disponible",
                            },
                            {
                              type: "edit",
                              onClick: () => { setMuebleSeleccionado(mueble); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(mueble.id_mue),
                            },
                          ]}
                        />
                      </td>
                    </motion.tr>
                  ))}
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
      {showModalEstado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
              ¿Estás seguro de cambiar el estado del Mueble?
            </h2>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowModalEstado(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioEstado}
                disabled={loadingCambioEstado}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {loadingCambioEstado ? "Cambiando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalAgregarMueble
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setMuebles={setMuebles as any}
      />
      <ModalEditarMueble
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        muebleSeleccionado={muebleSeleccionado as any}
        setMuebles={setMuebles as any}
      />
      <ModalVerMueble
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        muebleSeleccionado={muebleSeleccionado as any}
      />
    </div>
  );
}
