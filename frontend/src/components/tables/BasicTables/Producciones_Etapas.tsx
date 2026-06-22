import { useState } from "react";
import { useProduccionesEtapas } from "../../../hooks/producciones_etapas/useProduccion_Etapa";
import ProduccionesEtapasAdvancedFilters from "../../filters/ProduccionesEtapasAdvancedFilters";
import ModalAgregarProduccionEtapa from "../../ui/modal/produccion_etapa/AgregarModal";
import ModalEditarProduccionEtapa from "../../ui/modal/produccion_etapa/EditarModal";
import ModalVerProduccionEtapa from "../../ui/modal/produccion_etapa/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ListChecks, ChevronLeft, ChevronRight, Calendar, User, Factory, AlertCircle } from "lucide-react";
import Badge from "../../ui/badge/Badge";

export default function ProduccionEtapa() {
  const {
    setProduccionesEtapas,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showModalAgregar,
    setShowModalAgregar,
    paginatedData,
    totalPages,
    setFilters,
  } = useProduccionesEtapas();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [produccionetapaSeleccionado, setProduccionEtapaSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);

  const handleEliminar = async (id_pro_eta: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta producción etapa?");
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
      const res = await fetch(`http://localhost:8080/api/produccion-etapa/${id_pro_eta}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar producción etapa");

      setProduccionesEtapas((prev) => prev.filter((pta) => pta.id_pro_eta !== id_pro_eta));
    } catch (error) {
      console.error("Error al eliminar producción etapa:", error);
      alert("No se pudo eliminar la producción etapa.");
    }
  };

  return (
    <div className="space-y-4">
      <ProduccionesEtapasAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <ListChecks size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Seguimiento de Etapas</p>
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
          Asignar etapa
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {["Código", "Progreso de Etapa", "Info Adicional", "Producción Padre", "Acciones"].map((label) => (
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
                      <ListChecks size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin registros</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron asignaciones</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((proEta, idx) => {
                    const formatDate = (dateString?: string) => {
                      if (!dateString) return "—";
                      const date = new Date(dateString);
                      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                      return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
                    };

                    const iniEta = formatDate(proEta.fec_ini);
                    const finEta = formatDate(proEta.fec_fin);

                    return (
                      <motion.tr
                        key={proEta.id_pro_eta}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4 w-28">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {proEta.cod_pro_eta || "—"}
                          </span>
                        </td>

                        {/* Progreso de Etapa */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 leading-tight">
                              {proEta.etapa_produccion?.nom_eta || "Sin etapa"}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                              <Calendar size={12} className="text-gray-400" />
                              <span>{iniEta} - {finEta}</span>
                            </div>
                          </div>
                        </td>

                        {/* Info Adicional (Estado + Empleado + Notas) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <div className="flex items-center gap-2">
                              <Badge
                                size="sm"
                                color={
                                  proEta.est_eta === "Completado"
                                    ? "success"
                                    : proEta.est_eta === "Cancelado"
                                    ? "error"
                                    : "warning"
                                }
                              >
                                {proEta.est_eta || "Pendiente"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                              <User size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px]">
                                {proEta.empleado ? `${proEta.empleado.nom_emp} ${proEta.empleado.ap_pat_emp}` : "No asignado"}
                              </span>
                            </div>
                            {proEta.notas && (
                              <div className="flex items-start gap-1 mt-0.5 text-[10px] text-gray-500 italic max-w-[180px]">
                                <AlertCircle size={10} className="shrink-0 mt-0.5" />
                                <span className="truncate" title={proEta.notas}>{proEta.notas}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Producción Padre */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Factory size={12} className="text-orange-400" />
                              <span>Orden Global</span>
                            </div>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 pl-4.5">
                              {formatDate(proEta.produccion?.fec_ini)} - {formatDate(proEta.produccion?.fec_fin)}
                            </span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setProduccionEtapaSeleccionado(proEta); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setProduccionEtapaSeleccionado(proEta); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(proEta.id_pro_eta),
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
      <ModalAgregarProduccionEtapa
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setProduccionesEtapas={setProduccionesEtapas}
      />
      <ModalEditarProduccionEtapa
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        produccionetapaSeleccionado={produccionetapaSeleccionado}
        setProduccionesEtapas={setProduccionesEtapas}
      />
      <ModalVerProduccionEtapa
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        produccionetapaSeleccionado={produccionetapaSeleccionado}
      />
    </div>
  );
}
