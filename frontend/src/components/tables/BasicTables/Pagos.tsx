import { useState } from "react";
import { usePagos } from "../../../hooks/pagos/usePagos";
import ModalAgregarPago from "../../ui/modal/pago/AgregarModal";
import ModalEditarPago from "../../ui/modal/pago/EditarModal";
import ModalVerPago from "../../ui/modal/pago/VerDatos";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CreditCard, ChevronLeft, ChevronRight, Hash, DollarSign, Calendar, ShoppingCart } from "lucide-react";
import Badge from "../../ui/badge/Badge";
import SortableTableHeader from "../../ui/SortableTableHeader";
import PagosAdvancedFilters from "../../filters/PagosAdvancedFilters";

export default function Pagos() {
  const {
    setPagos,
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
  } = usePagos();

  const [showModalEditar, setShowModalEditar] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<any>(null);
  const [showModalVer, setShowModalVer] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("");

  const handleSort = (field: string) => {
    setCurrentSort(field);
    setSort(field);
  };

  const handleEliminar = async (id_pag: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este pago?");
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
      const res = await fetch(`http://localhost:8080/api/pago/${id_pag}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Error al eliminar pago");

      setPagos((prev) => prev.filter((pag) => pag.id_pag !== id_pag));
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      alert("No se pudo eliminar el pago.");
    }
  };

  return (
    <div className="space-y-4">
      <PagosAdvancedFilters onFiltersChange={setFilters} />

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Transacciones & Pagos</p>
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
          Registrar pago
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {[
                  { label: "Ref & Código", field: "cod_pag" },
                  { label: "Monto", field: "monto" },
                  { label: "Fecha y Método", field: "fec_pag" },
                  { label: "Origen Venta", field: null },
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
                      <CreditCard size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin pagos</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron transacciones</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((pago, idx) => {
                    const formatFecha = (dateString?: string) => {
                      if (!dateString) return "—";
                      const date = new Date(dateString);
                      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                      return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
                    };

                    return (
                      <motion.tr
                        key={pago.id_pag}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Ref & Código */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-xs font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded w-fit">
                              {pago.cod_pag || "—"}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <Hash size={12} />
                              <span className="truncate max-w-[150px]" title={pago.referencia_pag}>
                                {pago.referencia_pag || "Sin ref"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Monto */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                              <DollarSign size={14} />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {pago.monto?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-gray-500">Bs.</span>
                            </span>
                          </div>
                        </td>

                        {/* Fecha y Método */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                              <Calendar size={12} className="text-gray-400" />
                              <span>{formatFecha(pago.fec_pag)}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium rounded-full w-fit capitalize">
                              {pago.metodo_pag || "Otro"}
                            </span>
                          </div>
                        </td>

                        {/* Origen Venta */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                              <ShoppingCart size={12} className="text-purple-400" />
                              <span>Total Venta: <strong>{pago.venta?.total_ven ?? "-"}</strong> Bs.</span>
                            </div>
                            <Badge
                              size="sm"
                              color={
                                pago.venta?.est_ven === "Completado"
                                  ? "success"
                                  : pago.venta?.est_ven === "cancelado"
                                  ? "error"
                                  : "warning"
                              }
                            >
                              {pago.venta?.est_ven ?? "pendiente"}
                            </Badge>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setPagoSeleccionado(pago); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setPagoSeleccionado(pago); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(pago.id_pag),
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
      <ModalAgregarPago
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setPagos={setPagos}
      />
      <ModalEditarPago
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        pagoSeleccionado={pagoSeleccionado}
        setPagos={setPagos}
      />
      <ModalVerPago
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        pagoSeleccionado={pagoSeleccionado}
      />
    </div>
  );
}
