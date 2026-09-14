import { useState } from "react";
import { useEvidenciasProduccion } from "../../../hooks/evidencias_produccion/useEvidenciasProduccion";
import TableActionButtons from "../../ui/button/TableActionButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Camera, ChevronLeft, ChevronRight, User, FolderOpen, Image as ImageIcon, FileText } from "lucide-react";
import Swal from "sweetalert2";
import ModalAgregarEvidencia from "../../ui/modal/evidencia_produccion/AgregarModal";
import ModalEditarEvidencia from "../../ui/modal/evidencia_produccion/EditarModal";
import ModalVerEvidencia from "../../ui/modal/evidencia_produccion/VerDatos";

interface EvidenciaProduccion {
  id_evi: number;
  cod_evi?: string;
  id_pro_eta: number;
  tipo_evi: string;
  archivo_evi?: string;
  descripcion?: string;
  fec_evi?: string;
  id_emp: number;
  produccion_etapa?: {
    id_pro_eta: number;
    id_pro: number;
    etapa?: { nom_eta: string };
  };
  empleado?: { nom_emp: string; ape_emp?: string };
}

export default function EvidenciasProduccion() {
  const {
    setEvidenciasProduccion,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedData,
    loading,
  } = useEvidenciasProduccion();

  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [seleccionado, setSeleccionado] = useState<EvidenciaProduccion | null>(null);

  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar evidencia?",
      text: "El archivo también será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
        cancelButton: 'rounded-lg'
      }
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/api/evidencia-produccion/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
      setEvidenciasProduccion((prev) => prev.filter((e) => e.id_evi !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' }
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error al eliminar", customClass: { popup: 'rounded-2xl' } });
    }
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return "—";
    const d = new Date(fecha);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
            <Camera size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Evidencias de Producción</p>
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
          Subir evidencia
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/6 bg-white dark:bg-white/2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/6">
                {["Código", "Etapa Asociada", "Detalles & Archivo", "Responsable", "Acciones"].map((label) => (
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
                      <Camera size={40} strokeWidth={1.2} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium">Sin evidencias</p>
                      <p className="text-xs mt-1 opacity-70">No se encontraron archivos subidos</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {paginatedData.map((evi, idx) => {
                    const isImage = evi.tipo_evi?.toLowerCase().includes("imagen") || evi.tipo_evi?.toLowerCase().includes("foto");
                    
                    return (
                      <motion.tr
                        key={evi.id_evi}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                      >
                        {/* Código */}
                        <td className="px-5 py-4 w-28">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {evi.cod_evi || `EVI-${evi.id_evi}`}
                          </span>
                        </td>

                        {/* Etapa Asociada */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white leading-tight">
                              {evi.produccion_etapa?.etapa?.nom_eta || `Etapa ${evi.id_pro_eta}`}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Subido el {formatFecha(evi.fec_evi)}
                            </span>
                          </div>
                        </td>

                        {/* Detalles & Archivo */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              {isImage ? (
                                <ImageIcon size={14} className="text-blue-500" />
                              ) : (
                                <FileText size={14} className="text-amber-500" />
                              )}
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                {evi.tipo_evi}
                              </span>
                            </div>
                            {evi.descripcion && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title={evi.descripcion}>
                                {evi.descripcion}
                              </p>
                            )}
                            {evi.archivo_evi && (
                              <a
                                href={evi.archivo_evi.startsWith("http") ? evi.archivo_evi : `http://localhost:8080/storage/${evi.archivo_evi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 w-fit px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                              >
                                <FolderOpen size={12} />
                                Abrir adjunto
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Responsable */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                              <User size={12} className="text-gray-500" />
                            </div>
                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                              {evi.empleado?.nom_emp} {evi.empleado?.ape_emp || ""}
                            </span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 w-32">
                          <TableActionButtons
                            actions={[
                              {
                                type: "view",
                                onClick: () => { setSeleccionado(evi); setShowModalVer(true); },
                              },
                              {
                                type: "edit",
                                onClick: () => { setSeleccionado(evi); setShowModalEditar(true); },
                              },
                              {
                                type: "delete",
                                onClick: () => handleEliminar(evi.id_evi),
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
      <ModalAgregarEvidencia
        showModal={showModalAgregar}
        setShowModal={setShowModalAgregar}
        setEvidenciasProduccion={setEvidenciasProduccion}
      />
      <ModalEditarEvidencia
        showModal={showModalEditar}
        setShowModal={setShowModalEditar}
        evidenciaSeleccionado={seleccionado}
        setEvidenciasProduccion={setEvidenciasProduccion}
      />
      <ModalVerEvidencia
        showModal={showModalVer}
        setShowModal={setShowModalVer}
        evidenciaSeleccionado={seleccionado}
      />
    </div>
  );
}
