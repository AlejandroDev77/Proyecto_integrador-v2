import { useState } from "react";
import { useMateriales } from "../../../hooks/materiales/useMateriales";
import MaterialesAdvancedFilters from "../../filters/MaterialesAdvancedFilters";
import ModalAgregarMaterial from "../../ui/modal/material/AgregarModal";
import ModalEditarMaterial from "../../ui/modal/material/EditarModal";
import ModalVerMaterial from "../../ui/modal/material/VerDatos";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Package, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

export default function Materiales() {
  const {
    setMateriales,
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
  } = useMateriales();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_mat: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este material?");
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
      const res = await fetch(`http://localhost:8080/api/materiales/${id_mat}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar material");

      setMateriales((prev) => prev.filter((mat) => mat.id_mat !== id_mat));
    } catch (error) {
      console.error("Error al eliminar material:", error);
      alert("No se pudo eliminar el material.");
    }
  };

  return (
    <div className="space-y-4">
      <MaterialesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Package size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Materiales</p>
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
          Nuevo material
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",        field: "cod_mat"   },
                  { label: "Material",      field: "nom_mat"   },
                  { label: "Stock",         field: "stock_mat" },
                  { label: "Stock Mínimo",  field: null        },
                  { label: "Costo",         field: "costo_mat" },
                  { label: "Imagen",        field: null        },
                  { label: "Acciones",      field: null        },
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
                      <Package size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin materiales</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron materiales con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((material, idx) => (
                    <motion.tr
                      key={material.id_mat}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Código */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {material.cod_mat || "—"}
                        </span>
                      </td>

                      {/* Material (Nombre + Desc + Unidad) */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white leading-tight">
                              {material.nom_mat}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight max-w-[150px] truncate">
                                {material.desc_mat || "Sin descripción"}
                              </span>
                              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                {material.unidad_medida}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          material.stock_mat <= material.stock_min
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        }`}>
                          {material.stock_mat}
                        </span>
                      </td>

                      {/* Stock Min */}
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {material.stock_min}
                      </td>

                      {/* Costo */}
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-200">
                        Bs. {material.costo_mat}
                      </td>

                      {/* Imagen */}
                      <td className="px-5 py-4">
                        {material.img_mat ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-white">
                            <img
                              src={material.img_mat}
                              alt="Material"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-white/5">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setMaterialSeleccionado(material); setShowModalVer(true); },
                            },
                            {
                              type: "toggle",
                              onClick: () => abrirModalEstado(material.id_mat, material.est_mat),
                              isActive: material.est_mat,
                              activeLabel: "Baja",
                              inactiveLabel: "Alta",
                            },
                            {
                              type: "edit",
                              onClick: () => { setMaterialSeleccionado(material); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(material.id_mat),
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
              ¿Estás seguro de cambiar el estado del material?
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

      <ModalAgregarMaterial
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setMateriales={setMateriales}
      />
      <ModalEditarMaterial
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        materialSeleccionado={materialSeleccionado}
        setMateriales={setMateriales}
      />
      <ModalVerMaterial
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        materialSeleccionado={materialSeleccionado}
      />
    </div>
  );
}
