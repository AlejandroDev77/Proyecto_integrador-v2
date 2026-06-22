import { useState } from "react";
import { useCotizaciones } from "../../../hooks/cotizaciones/useCotizaciones";
import CotizacionesAdvancedFilters from "../../filters/CotizacionesAdvancedFilters";
import SortableTableHeader from "../../ui/SortableTableHeader";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Settings, FileSignature, ChevronLeft, ChevronRight, Calendar, Clock, User, Briefcase } from "lucide-react";
import ModalAgregarCotizacion from "../../ui/modal/cotizacion/AgregarModal";
import ModalEditarCotizacion from "../../ui/modal/cotizacion/EditarModal";
import ModalVerCotizacion from "../../ui/modal/cotizacion/VerDatos";
import ModalGestionCotizacion from "../../ui/modal/negocio/ModalGestionCotizacion";
import Badge from "../../ui/badge/Badge";

export default function Cotizaciones() {
  const {
    setCotizaciones,
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
  } = useCotizaciones();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [cotizacionSeleccionado, setCotizacionSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [showModalGestion, setShowModalGestion] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const fetchCotizacionesData = async () => {
    setFilters({});
  };

  const handleEliminar = async (id_cot: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta cotización?");
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
      const res = await fetch(`http://localhost:8080/api/cotizacion/${id_cot}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar cotización");

      setCotizaciones((prev) => prev.filter((cot) => cot.id_cot !== id_cot));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la cotización.");
    }
  };

  return (
    <div className="space-y-4">
      <CotizacionesAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <FileSignature size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Cotizaciones</p>
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
          Nueva cotización
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Código",    field: "cod_cot" },
                  { label: "Fechas",    field: "fec_cot" },
                  { label: "Importes",  field: "total_cot" },
                  { label: "Involucrados", field: null },
                  { label: "Estado",    field: "est_cot" },
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
                      <FileSignature size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin cotizaciones</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron cotizaciones con esos filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((cot, idx) => {
                    const fecha = new Date(cot.fec_cot);
                    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
                    const fechaStr = fecha.toLocaleDateString("es-ES", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                    });

                    return (
                      <motion.tr
                        key={cot.id_cot}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {cot.cod_cot || "—"}
                          </span>
                        </td>

                        {/* Fechas (Fecha + Validez) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-800 dark:text-gray-200 font-medium">
                              <Calendar size={12} className="text-gray-400" />
                              <span>{fechaStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                              <Clock size={12} className="text-orange-400" />
                              <span>Válido {cot.validez_dias} días</span>
                            </div>
                          </div>
                        </td>

                        {/* Importes (Total + Descuento) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              Bs. {cot.total_cot}
                            </span>
                            {Number(cot.descuento) > 0 && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded w-fit">
                                - Bs. {cot.descuento} desc.
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Involucrados (Cliente + Empleado) */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs">
                              <User size={12} className="text-indigo-400 shrink-0" />
                              <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                                {cot.cliente ? `${cot.cliente.nom_cli} ${cot.cliente.ap_pat_cli}` : "—"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                              <Briefcase size={12} className="shrink-0" />
                              <span className="truncate max-w-[150px]">
                                {cot.empleado ? `${cot.empleado.nom_emp} ${cot.empleado.ap_pat_emp}` : "—"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          <Badge
                            size="sm"
                            color={
                              cot.est_cot === "Aprobado"
                                ? "success"
                                : cot.est_cot === "Rechazado"
                                ? "error"
                                : "warning"
                            }
                          >
                            {cot.est_cot}
                          </Badge>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <div className="flex items-center gap-2">
                            <TableActionButtons
                              actions={[
                                {
                                  type: "view",
                                  onClick: () => { setCotizacionSeleccionado(cot); setShowModalVer(true); },
                                },
                                {
                                  type: "edit",
                                  onClick: () => { setCotizacionSeleccionado(cot); setShowModalEditar(true); },
                                },
                                {
                                  type: "delete",
                                  onClick: () => handleEliminar(cot.id_cot),
                                },
                              ]}
                            />
                            {cot.est_cot === "Pendiente" && (
                              <button
                                onClick={() => { setCotizacionSeleccionado(cot); setShowModalGestion(true); }}
                                className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/30 transition-colors"
                                title="Gestionar Cotización"
                              >
                                <Settings size={14} />
                              </button>
                            )}
                          </div>
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
      <ModalAgregarCotizacion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setCotizaciones={setCotizaciones}
      />
      <ModalEditarCotizacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        cotizacionSeleccionada={cotizacionSeleccionado}
        setCotizaciones={setCotizaciones}
      />
      <ModalVerCotizacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        cotizacionSeleccionada={cotizacionSeleccionado}
      />
      <ModalGestionCotizacion
        showModal={showModalGestion}
        setShowModal={setShowModalGestion}
        cotizacion={cotizacionSeleccionado}
        onUpdate={fetchCotizacionesData}
      />
    </div>
  );
}
