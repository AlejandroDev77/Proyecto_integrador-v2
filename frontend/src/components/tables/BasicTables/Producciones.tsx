import { useState } from "react";
import { useProducciones } from "../../../hooks/producciones/useProducciones";
import ProduccionesAdvancedFilters from "../../filters/ProduccionesAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Factory, ChevronLeft, ChevronRight, Calendar, User, ShoppingBag, FileSignature, AlertCircle } from "lucide-react";
import ModalAgregarProduccion from "../../ui/modal/produccion/AgregarModal";
import ModalEditarProduccion from "../../ui/modal/produccion/EditarModal";
import ModalVerProduccion from "../../ui/modal/produccion/VerDatos";
import Badge from "../../ui/badge/Badge";

export default function Produccion() {
  const {
    setProducciones,
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
  } = useProducciones();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [produccionSeleccionado, setProduccionSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_pro: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta producción?");
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
      const res = await fetch(`http://localhost:8080/api/produccion/${id_pro}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar producción");

      setProducciones((prev) => prev.filter((pro) => pro.id_pro !== id_pro));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la producción.");
    }
  };

  return (
    <div className="space-y-4">
      <ProduccionesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Factory size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Órdenes de Producción</p>
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
          Nueva orden
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",    field: "cod_pro" },
                  { label: "Cronograma",field: "fec_ini" },
                  { label: "Estado & Info", field: "est_pro" },
                  { label: "Origen (Vta/Cot)", field: null },
                  { label: "Responsable", field: null },
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
                      <Factory size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin producciones</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron producciones con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((pro, idx) => {
                    const formatDate = (dateString?: string) => {
                      if (!dateString) return "—";
                      const date = new Date(dateString);
                      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                      return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
                    };

                    const fecIni = formatDate(pro.fec_ini);
                    const fecFin = formatDate(pro.fec_fin);
                    const fecEst = formatDate(pro.fec_fin_estimada);

                    return (
                      <motion.tr
                        key={pro.id_pro}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                            {pro.cod_pro || "—"}
                          </span>
                        </td>

                        {/* Cronograma */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-indigo-400" />
                              <span>Inicio: {fecIni}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-amber-500" />
                              <span>Est: {fecEst}</span>
                            </div>
                            {pro.fec_fin && (
                              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                <Calendar size={12} />
                                <span>Fin: {fecFin}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Estado & Info */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <div className="flex items-center gap-2">
                              <Badge
                                size="sm"
                                color={
                                  pro.est_pro === "Completado"
                                    ? "success"
                                    : pro.est_pro === "Cancelado"
                                    ? "error"
                                    : "warning"
                                }
                              >
                                {pro.est_pro || "Pendiente"}
                              </Badge>
                              {pro.prioridad && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                                  pro.prioridad === 'Alta' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                  pro.prioridad === 'Media' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                                  'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                }`}>
                                  {pro.prioridad}
                                </span>
                              )}
                            </div>
                            {pro.notas && (
                              <div className="flex gap-1 mt-1 text-[10px] text-gray-500 italic max-w-[150px]">
                                <AlertCircle size={12} className="shrink-0 mt-0.5" />
                                <span className="truncate" title={pro.notas}>{pro.notas}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Origen (Vta/Cot) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            {pro.venta ? (
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 font-medium">
                                  <ShoppingBag size={12} className="text-teal-500" />
                                  <span>Venta: {formatDate(pro.venta.fec_ven)}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 ml-4.5">{pro.venta.est_ven}</span>
                              </div>
                            ) : pro.cotizacion ? (
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 font-medium">
                                  <FileSignature size={12} className="text-purple-500" />
                                  <span>Cotiz: {formatDate(pro.cotizacion.fec_cot)}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 ml-4.5">{pro.cotizacion.est_cot}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sin origen</span>
                            )}
                          </div>
                        </td>

                        {/* Responsable */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                              <User size={12} className="text-gray-500" />
                            </div>
                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate max-w-[130px]">
                              {pro.empleado ? `${pro.empleado.nom_emp} ${pro.empleado.ap_pat_emp}` : "No asignado"}
                            </span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setProduccionSeleccionado(pro); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setProduccionSeleccionado(pro); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(pro.id_pro),
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
      <ModalAgregarProduccion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setProducciones={setProducciones}
      />
      <ModalEditarProduccion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        produccionSeleccionado={produccionSeleccionado}
        setProducciones={setProducciones}
      />
      <ModalVerProduccion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        produccionSeleccionado={produccionSeleccionado}
      />
    </div>
  );
}
