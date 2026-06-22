import { useState } from "react";
import { useCategoriasMuebles } from "../../../hooks/categorias_muebles/useCategorias_Muebles";
import ModalAgregarCategoriaMueble from "../../ui/modal/categoria_mueble/AgregarModal";
import ModalEditarCategoriaMueble from "../../ui/modal/categoria_mueble/EditarModal";
import ModalVerCategoriaMueble from "../../ui/modal/categoria_mueble/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import SortableTableHeader from "../../ui/SortableTableHeader";
import CategoriaMueblesAdvancedFilters from "../../filters/CategoriaMueblesAdvancedFilters";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tags, ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriasMuebles() {
  const {
    setCategoriasMuebles,
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
  } = useCategoriasMuebles();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [categoriamuebleSeleccionado, setCategoriaMuebleSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_cat: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta categoría?");
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
      const res = await fetch(`http://localhost:8080/api/categoria-mueble/${id_cat}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar categoría");

      setCategoriasMuebles((prev) => prev.filter((cat) => cat.id_cat !== id_cat));
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  return (
    <div className="space-y-4">
      <CategoriaMueblesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Tags size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Categorías de Muebles</p>
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
          Nueva categoría
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",      field: "cod_cat" },
                  { label: "Categoría",   field: "nom_cat" },
                  { label: "Descripción", field: "desc_cat" },
                  { label: "Acciones",    field: null },
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
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Tags size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin categorías</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron categorías con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((cat, idx) => (
                    <motion.tr
                      key={cat.id_cat}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Código */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {cat.cod_cat || "—"}
                        </span>
                      </td>

                      {/* Nombre */}
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                        {cat.nom_cat}
                      </td>

                      {/* Descripción */}
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400 max-w-md truncate">
                        {cat.desc_cat || "Sin descripción"}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4 w-32">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setCategoriaMuebleSeleccionado(cat); setShowModalVer(true); },
                            },
                            {
                              type: "edit",
                              onClick: () => { setCategoriaMuebleSeleccionado(cat); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(cat.id_cat),
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
      <ModalAgregarCategoriaMueble
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setCategoriasMuebles={setCategoriasMuebles}
      />
      <ModalEditarCategoriaMueble
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        categoriamuebleSeleccionado={categoriamuebleSeleccionado}
        setCategoriasMuebles={setCategoriasMuebles}
      />
      <ModalVerCategoriaMueble
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        categoriamuebleSeleccionado={categoriamuebleSeleccionado}
      />
    </div>
  );
}
