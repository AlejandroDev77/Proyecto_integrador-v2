import { useState } from "react";
import { useCostosCotizacion } from "../../../hooks/costos_cotizacion/useCostosCotizacion";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calculator, ChevronLeft, ChevronRight, TrendingUp, HandCoins, Factory, Wrench } from "lucide-react";
import Swal from "sweetalert2";
import ModalAgregarCostoCotizacion from "../../ui/modal/costo_cotizacion/AgregarModal";
import ModalEditarCostoCotizacion from "../../ui/modal/costo_cotizacion/EditarModal";
import ModalVerCostoCotizacion from "../../ui/modal/costo_cotizacion/VerDatos";

interface CostoCotizacion {
  id_costo: number;
  id_cot: number;
  costo_materiales?: number;
  costo_mano_obra?: number;
  costos_indirectos?: number;
  margen_ganancia?: number;
  costo_total?: number;
  precio_sugerido?: number;
  cotizacion?: { cod_cot?: string; fec_cot?: string };
}

export default function CostosCotizacion() {
  const {
    setCostosCotizacion,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedData,
    loading,
  } = useCostosCotizacion();

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [seleccionado, setSeleccionado] = useState<CostoCotizacion | null>(null);

  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar costo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/api/costo-cotizacion/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
      setCostosCotizacion((prev) => prev.filter((c) => c.id_costo !== id));
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error al eliminar" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Calculator size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Costos de Cotización</p>
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
          Nuevo costo
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {["Cotización", "Desglose de Costos", "Resumen Final", "Acciones"].map((label) => (
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
                      <Calculator size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin costos</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron registros de costos</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((costo, idx) => (
                    <motion.tr
                      key={costo.id_costo}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Cotización */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                          {costo.cotizacion?.cod_cot || `COT-${costo.id_cot}`}
                        </span>
                      </td>

                      {/* Desglose de Costos */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <Wrench size={12} className="text-blue-500" />
                            <span className="w-20">Materiales:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              Bs. {Number(costo.costo_materiales || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HandCoins size={12} className="text-amber-500" />
                            <span className="w-20">Mano Obra:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              Bs. {Number(costo.costo_mano_obra || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Factory size={12} className="text-purple-500" />
                            <span className="w-20">Indirectos:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              Bs. {Number(costo.costos_indirectos || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Resumen Final */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg w-fit">
                            <span className="text-xs text-gray-500">Costo Total:</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              Bs. {Number(costo.costo_total || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              <TrendingUp size={10} />
                              {Number(costo.margen_ganancia || 0).toFixed(1)}% Margen
                            </div>
                            <span className="text-xs text-gray-400">→</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              Sugerido: Bs. {Number(costo.precio_sugerido || 0).toFixed(2)}
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
                              onClick: () => { setSeleccionado(costo); setShowModalVer(true); },
                            },
                            {
                              type: "edit",
                              onClick: () => { setSeleccionado(costo); setShowModalEditar(true); },
                            },
                            {
                              type: "delete",
                              onClick: () => handleEliminar(costo.id_costo),
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
      <ModalAgregarCostoCotizacion
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setCostosCotizacion={setCostosCotizacion}
      />
      <ModalEditarCostoCotizacion
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        costoCotizacionSeleccionado={seleccionado}
        setCostosCotizacion={setCostosCotizacion}
      />
      <ModalVerCostoCotizacion
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        costoCotizacionSeleccionado={seleccionado}
      />
    </div>
  );
}
