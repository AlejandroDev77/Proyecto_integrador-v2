import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Plus,
  Box,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Cpu,
  ImageIcon,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from "lucide-react";
import Badge from "../../../ui/badge/Badge";
import TableActionButtons from "../../../ui/button/TableActionButtons";
import { generacionIAService } from "../../../../services/generacionIAService";
import { GeneracionIA as IGeneracionIA } from "../../../../types/generacionIA";
import Generar3DModal from "../../../ui/modal/ia/Generar3DModal";
import Visualizador3DModal from "../../../ui/modal/ia/Visualizador3DModal";
import Swal from "sweetalert2";

// ── Helpers ──────────────────────────────────────────────────────────────────

const estadoConfig: Record<
  string,
  { label: string; color: "success" | "warning" | "error" | "info"; Icon: LucideIcon }
> = {
  completado: { label: "Completado",  color: "success", Icon: CheckCircle },
  procesando: { label: "Procesando",  color: "warning", Icon: Clock       },
  error:      { label: "Error",       color: "error",   Icon: XCircle     },
};

function EstadoBadge({ estado }: { estado: string }) {
  const cfg = estadoConfig[estado] ?? { label: estado, color: "info", Icon: Cpu };
  const { label, color, Icon } = cfg;
  return (
    <Badge size="sm" color={color}>
      <span className="flex items-center gap-1.5">
        <Icon size={12} />
        {label}
      </span>
    </Badge>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function GeneracionIA() {
  const [generaciones, setGeneraciones] = useState<IGeneracionIA[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showVisualizador, setShowVisualizador] = useState(false);
  const [selectedModelUrl, setSelectedModelUrl] = useState<string | null>(null);
  const [selectedModelTitle, setSelectedModelTitle] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generacionIAService.getAll();
      setGeneraciones(data.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error cargando generaciones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Client-side pagination logic
  const totalPages = Math.max(1, Math.ceil(generaciones.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return generaciones.slice(startIndex, startIndex + itemsPerPage);
  }, [generaciones, currentPage, itemsPerPage]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar generación?",
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
        cancelButton: 'rounded-lg'
      }
    });

    if (result.isConfirmed) {
      try {
        await generacionIAService.delete(id);
        setGeneraciones((prev) => prev.filter((g) => g.id !== id));
        Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
      } catch {
        Swal.fire({ icon: "error", title: "Error al eliminar la generación", customClass: { popup: 'rounded-2xl' } });
      }
    }
  };

  const handleVerModelo = (gen: IGeneracionIA) => {
    if (gen.modelo_3d_url) {
      setSelectedModelUrl(gen.modelo_3d_url);
      setSelectedModelTitle(gen.nom_mue);
      setShowVisualizador(true);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Barra de acciones ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Cpu size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Modelos generados
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {generaciones.length} registro{generaciones.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-orange-500" : ""} />
            Actualizar
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20 transition-all active:scale-95"
          >
            <Plus size={16} />
            Nueva generación
          </button>
        </div>
      </div>

      {/* ── Tabla ───────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {["Nombre del Mueble", "Referencias", "Estado", "Modelo 3D", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-white/4">
              {loading ? (
                /* Skeleton */
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded-md bg-gray-100 dark:bg-white/6 animate-pulse w-full max-w-[150px]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : generaciones.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                      <Box size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin generaciones todavía</p>
                      <p className="text-xs mt-1 opacity-70">
                        Crea tu primera generación con el botón superior
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((gen, idx) => (
                    <motion.tr
                      key={gen.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, delay: idx * 0.03 }}
                      className="group hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Nombre */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {gen.nom_mue}
                        </span>
                      </td>

                      {/* Imágenes */}
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5 flex-wrap max-w-40">
                          {gen.imgs_ref && gen.imgs_ref.length > 0 ? (
                            gen.imgs_ref.slice(0, 3).map((img, i) => (
                              <div
                                key={i}
                                className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm shrink-0"
                              >
                                <img
                                  src={img}
                                  alt={`Ref ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md">
                              <ImageIcon size={14} />
                              <span className="text-xs font-medium">Sin imágenes</span>
                            </div>
                          )}
                          {gen.imgs_ref && gen.imgs_ref.length > 3 && (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 shadow-sm">
                              +{gen.imgs_ref.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-4">
                        <EstadoBadge estado={gen.estado} />
                      </td>

                      {/* Modelo */}
                      <td className="px-5 py-4">
                        {gen.modelo_3d_url ? (
                          <button
                            onClick={() => handleVerModelo(gen)}
                            className="flex items-center gap-1.5 w-fit px-2.5 py-1.5 bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 rounded-lg text-xs font-semibold hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                          >
                            <Box size={14} />
                            Ver modelo 3D
                          </button>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 italic px-2 py-1 bg-gray-50 dark:bg-white/5 rounded-md w-fit">
                            <Clock size={12} />
                            {gen.estado === "procesando" ? "Generando..." : "No disponible"}
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4 w-32">
                        <TableActionButtons
                          actions={[
                            {
                              type: "delete",
                              onClick: () => gen.id && handleDelete(gen.id),
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

      {/* ── Modales ─────────────────────────────────────────────────────── */}
      <Generar3DModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSuccess={fetchData}
      />
      <Visualizador3DModal
        isOpen={showVisualizador}
        onClose={() => setShowVisualizador(false)}
        modelUrl={selectedModelUrl || ""}
        title={selectedModelTitle}
      />
    </div>
  );
}
