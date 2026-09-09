import { useState } from "react";
import { useDiseños } from "../../../hooks/diseños/useDiseños";
import DiseñosAdvancedFilters from "../../filters/DiseñosAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, PenTool, ChevronLeft, ChevronRight, Box, Image as ImageIcon, FileSignature } from "lucide-react";
import ModalAgregarDiseño from "../../ui/modal/diseño/AgregarModal";
import ModalEditarDiseño from "../../ui/modal/diseño/EditarModal";
import ModalVerDiseño from "../../ui/modal/diseño/VerDatos";

export default function Diseños() {
  const {
    setDiseños,
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
  } = useDiseños();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [diseñoSeleccionado, setDiseñoSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_dis: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este diseño?");
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
      const res = await fetch(`http://localhost:8080/api/disenos/${id_dis}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar diseño");

      setDiseños((prev) => prev.filter((dis) => (dis.id_dis || (dis as any).id) !== id_dis));
    } catch (error) {
      console.error("Error al eliminar diseño:", error);
      alert("No se pudo eliminar el diseño.");
    }
  };

  return (
    <div className="space-y-4">
      <DiseñosAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <PenTool size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Diseños 3D & Referencias</p>
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
          Nuevo diseño
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código", field: "cod_dis" },
                  { label: "Preview", field: null },
                  { label: "Detalles", field: "nom_dis" },
                  { label: "Archivos Base", field: null },
                  { label: "Cotización Vinculada", field: null },
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
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <PenTool size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin diseños</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron diseños con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((dis, idx) => (
                    <motion.tr
                      key={dis.id_dis || (dis as any).id || idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Código */}
                      <td className="px-5 py-4 w-28">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {dis.cod_dis || "—"}
                        </span>
                      </td>

                      {/* Preview Imagen */}
                      <td className="px-5 py-4 w-16">
                        {dis.img_dis ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-black/20">
                            <img
                              src={dis.img_dis.startsWith("http") ? dis.img_dis : `http://localhost:8080/storage/${dis.img_dis.replace("public/", "")}`}
                              alt={dis.nom_dis}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20">
                            <ImageIcon size={16} className="text-gray-400" />
                          </div>
                        )}
                      </td>

                      {/* Detalles (Nombre + Descripcion) */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white leading-tight">
                            {dis.nom_dis}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-[250px]" title={dis.desc_dis}>
                            {dis.desc_dis || "Sin descripción"}
                          </span>
                        </div>
                      </td>

                      {/* Archivos Base */}
                      <td className="px-5 py-4">
                        {dis.archivo_3d || (dis as any).archivo3d ? (
                          <a
                            href={(dis.archivo_3d || (dis as any).archivo3d).startsWith("http") ? (dis.archivo_3d || (dis as any).archivo3d) : `http://localhost:8080/storage/${(dis.archivo_3d || (dis as any).archivo3d).replace("public/", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 w-fit px-2 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                          >
                            <Box size={12} />
                            Modelo 3D
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Sin modelo 3D</span>
                        )}
                      </td>

                      {/* Cotización Vinculada */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          {dis.cotizacion?.fec_cot ? (
                            <div className="flex items-center gap-1.5 font-medium">
                              <FileSignature size={12} className="text-purple-500" />
                              <span>Cotización Activa</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Independiente</span>
                          )}
                          {dis.cotizacion?.fec_cot && (
                            <span className="text-[10px] text-gray-400 pl-4.5">
                              {new Date(dis.cotizacion.fec_cot).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4 w-32">
                        <TableActionButtons
                          actions={[
                            {
                              type: "view",
                              onClick: () => { setDiseñoSeleccionado(dis); setShowModalVer(true); },
                            },
                            {
                              type: "edit",
                              onClick: () => { setDiseñoSeleccionado(dis); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(dis.id_dis || (dis as any).id),
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
      <ModalAgregarDiseño
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setDiseños={setDiseños}
      />
      <ModalEditarDiseño
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        diseñoSeleccionado={diseñoSeleccionado}
        setDiseños={setDiseños}
      />
      <ModalVerDiseño
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        diseñoSeleccionado={diseñoSeleccionado}
      />
    </div>
  );
}
