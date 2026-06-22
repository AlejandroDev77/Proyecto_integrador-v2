import { useState } from "react";
import { useEtapasProducciones } from "../../../hooks/etapas_producciones/useEtapas_Producciones";
import EtapasProduccionAdvancedFilters from "../../filters/EtapasProduccionAdvancedFilters";
import ModalAgregarEtapaProduccion from "../../ui/modal/etapa_produccion/AgregarModal";
import ModalEditarEtapaProduccion from "../../ui/modal/etapa_produccion/EditarModal";
import ModalVerEtapaProduccion from "../../ui/modal/etapa_produccion/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Route, ChevronLeft, ChevronRight, Clock, Layers } from "lucide-react";

export default function EtapaProduccion() {
  const {
    setEtapasProducciones,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    totalPages,
    setFilters,
  } = useEtapasProducciones();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [etapaproduccionSeleccionado, setEtapaProduccionSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);

  const handleEliminar = async (id_eta: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta etapa de producción?");
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
      const res = await fetch(`http://localhost:8080/api/etapa-produccion/${id_eta}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar etapa de producción");

      setEtapasProducciones((prev) => prev.filter((eta) => eta.id_eta !== id_eta));
    } catch (error) {
      console.error("Error al eliminar etapa de producción:", error);
      alert("No se pudo eliminar la etapa de producción.");
    }
  };

  return (
    <div className="space-y-4">
      <EtapasProduccionAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Route size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Etapas Base</p>
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
          Nueva etapa
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {["Código", "Nombre y Descripción", "Especificaciones", "Acciones"].map((label) => (
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
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Route size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin etapas</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron etapas base</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((eta, idx) => (
                    <motion.tr
                      key={eta.id_eta}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Código */}
                      <td className="px-5 py-4 w-32">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {eta.cod_eta || "—"}
                        </span>
                      </td>

                      {/* Nombre y Descripción */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {eta.nom_eta || "Sin Nombre"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-[300px]" title={eta.desc_eta}>
                            {eta.desc_eta || "Sin Descripción"}
                          </span>
                        </div>
                      </td>

                      {/* Especificaciones */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-1 rounded font-medium w-fit">
                              <Clock size={12} />
                              {eta.duracion_estimada || 0} Días
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 px-2 py-1 rounded font-medium w-fit">
                              <Layers size={12} />
                              Orden: {eta.orden_secuencia || 0}
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
                              onClick: () => { setEtapaProduccionSeleccionado(eta); setShowModalVer(true); },
                            },
                            {
                              type: "edit",
                              onClick: () => { setEtapaProduccionSeleccionado(eta); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(eta.id_eta),
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
      <ModalAgregarEtapaProduccion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setEtapasProducciones={setEtapasProducciones}
      />
      <ModalEditarEtapaProduccion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        etapaproduccionSeleccionado={etapaproduccionSeleccionado}
        setEtapasProducciones={setEtapasProducciones}
      />
      <ModalVerEtapaProduccion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        etapaproduccionSeleccionado={etapaproduccionSeleccionado}
      />
    </div>
  );
}
