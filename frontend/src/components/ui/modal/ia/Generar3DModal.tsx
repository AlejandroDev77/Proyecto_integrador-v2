import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  X,
  UploadCloud,
  Trash2,
  Box,
  Cpu,
  ChevronRight,
  ImagePlus,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { r2Service } from "../../../../services/r2Service";
import { generacionIAService } from "../../../../services/generacionIAService";
import { getMuebles } from "../../../../services/muebleService";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSuccess: () => void;
}

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_MS      = 12 * 60 * 1000;

// ── Pasos del proceso ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Subiendo imágenes",      icon: UploadCloud  },
  { id: 2, label: "Registrando",            icon: Layers       },
  { id: 3, label: "Generando con Tripo AI", icon: Cpu          },
  { id: 4, label: "Guardando modelo",       icon: Box          },
];

export default function Generar3DModal({ showModal, setShowModal, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting]         = useState(false);
  const [nomMueble, setNomMueble]               = useState("");
  const [selectedMuebleId, setSelectedMuebleId] = useState<number | null>(null);
  const [files, setFiles]                       = useState<File[]>([]);
  const [previews, setPreviews]                 = useState<string[]>([]);
  const [muebles, setMuebles]                   = useState<any[]>([]);
  const [activeStep, setActiveStep]             = useState(0);
  const [progressPct, setProgressPct]           = useState(0);
  const [isDragging, setIsDragging]             = useState(false);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const pollTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartRef  = useRef<number>(0);
  const dropZoneRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showModal) fetchMuebles();
    return () => stopPolling();
  }, [showModal]);

  const fetchMuebles = async () => {
    try {
      const data = await getMuebles(1, 100);
      setMuebles(data.data || []);
    } catch {}
  };

  const addFiles = (newFiles: File[]) => {
    const images = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...images]);
    setPreviews((prev) => [...prev, ...images.map((f) => URL.createObjectURL(f))]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev)    => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const stopPolling = () => {
    if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    stopPolling();
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNomMueble(""); setSelectedMuebleId(null);
    setFiles([]); setPreviews([]);
    setIsSubmitting(false); setActiveStep(0); setProgressPct(0);
  };

  const handleSubmit = async () => {
    if ((!nomMueble && !selectedMuebleId) || files.length === 0) return;
    setIsSubmitting(true);
    setActiveStep(1);
    setProgressPct(5);

    try {
      // Paso 1: subir imágenes
      const imageUrls = await Promise.all(
        files.map((f) => r2Service.uploadFile(f, "ia-temp"))
      );

      // Paso 2: registrar
      setActiveStep(2); setProgressPct(15);
      const finalNom = selectedMuebleId
        ? muebles.find((m) => m.id_mue === selectedMuebleId)?.nom_mue
        : nomMueble;

      const created = await generacionIAService.create({
        nom_mue: finalNom || "Mueble sin nombre",
        imgs_ref: imageUrls,
        estado: "procesando",
        id_mue: selectedMuebleId || undefined,
      });

      const recordId: number = created?.id ?? created?.data?.id;
      if (!recordId) throw new Error("No se pudo obtener el ID del registro.");

      // Paso 3: Tripo AI genera en background
      setActiveStep(3); setProgressPct(20);
      await iniciarPolling(recordId);

    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.message || "Algo salió mal." });
      setIsSubmitting(false);
      setActiveStep(0);
    }
  };

  const iniciarPolling = (recordId: number): Promise<void> =>
    new Promise((resolve) => {
      pollStartRef.current = Date.now();

      pollTimerRef.current = setInterval(async () => {
        try {
          const elapsed    = Date.now() - pollStartRef.current;
          const elapsedMin = elapsed / 60000;

          if (elapsed > MAX_POLL_MS) {
            stopPolling();
            Swal.fire({ icon: "warning", title: "Tiempo agotado",
              text: "La generación sigue en proceso. Revisa la tabla más tarde." });
            onSuccess(); handleClose(); resolve(); return;
          }

          setProgressPct(Math.min(90, 20 + Math.round(elapsedMin * 23)));

          const record = await generacionIAService.getById(recordId);
          const estado: string = record?.estado ?? record?.data?.estado;

          if (estado === "completado") {
            stopPolling();
            setActiveStep(4); setProgressPct(100);
            await new Promise((r) => setTimeout(r, 700));
            Swal.fire({ icon: "success", title: "Modelo 3D generado",
              text: "Tu modelo fue creado y guardado correctamente.",
              showConfirmButton: false, timer: 2000 });
            onSuccess(); handleClose(); resolve();
          } else if (estado === "error") {
            stopPolling();
            Swal.fire({ icon: "error", title: "Error en la generación",
              text: "Tripo AI no pudo generar el modelo. Intenta con imágenes más claras." });
            setIsSubmitting(false); setActiveStep(0); resolve();
          }
        } catch {}
      }, POLL_INTERVAL_MS);
    });

  if (!showModal) return null;

  const canSubmit = (nomMueble || selectedMuebleId) && files.length > 0 && !isSubmitting;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-gray-100 dark:border-white/[0.06]"
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-400/10 dark:text-orange-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Generar modelo 3D
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Powered by Tripo AI
                  </p>
                </div>
              </div>
              {!isSubmitting && (
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* ── Contenido ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Panel de progreso */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5 p-4 space-y-4"
                >
                  {/* Pasos */}
                  <div className="flex items-center gap-1">
                    {STEPS.map((step, i) => {
                      const done    = activeStep > step.id;
                      const current = activeStep === step.id;
                      return (
                        <div key={step.id} className="flex items-center gap-1 flex-1 min-w-0">
                          <div
                            className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 transition-all ${
                              done    ? "bg-green-500 text-white" :
                              current ? "bg-orange-500 text-white" :
                                        "bg-gray-200 dark:bg-white/[0.08] text-gray-400"
                            }`}
                          >
                            {done ? <CheckCircle2 size={14} /> : <step.icon size={13} />}
                          </div>
                          <p className={`text-xs truncate hidden sm:block transition-colors ${
                            current ? "text-orange-600 dark:text-orange-400 font-medium" :
                            done    ? "text-green-600 dark:text-green-400" :
                                      "text-gray-400"
                          }`}>
                            {step.label}
                          </p>
                          {i < STEPS.length - 1 && (
                            <ChevronRight size={12} className="text-gray-300 dark:text-white/20 flex-shrink-0 ml-1" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Barra */}
                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 rounded-full bg-orange-200 dark:bg-orange-500/20 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-orange-500"
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        {STEPS.find((s) => s.id === activeStep)?.label ?? "Procesando..."}
                      </p>
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {progressPct}%
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    La generación 3D puede tardar entre 2 y 8 minutos. No cierres esta ventana.
                  </p>
                </motion.div>
              )}

              {/* ── Formulario ───────────────────────────────────────── */}

              {/* Mueble */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mueble de referencia
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Seleccionar existente</p>
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50 transition"
                      value={selectedMuebleId || ""}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setSelectedMuebleId(Number(e.target.value) || null);
                        if (e.target.value) setNomMueble("");
                      }}
                    >
                      <option value="">— Seleccionar —</option>
                      {muebles.map((m) => (
                        <option key={m.id_mue} value={m.id_mue}>{m.nom_mue}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">O escribir nombre nuevo</p>
                    <input
                      type="text"
                      placeholder="Ej: Silla de Oficina"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50 transition"
                      value={nomMueble}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setNomMueble(e.target.value);
                        if (e.target.value) setSelectedMuebleId(null);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Imágenes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imágenes de referencia
                  </label>
                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-full">
                    {files.length === 1 ? "Vista frontal" : files.length > 1 ? `${files.length} vistas — Multiview` : "Ninguna"}
                  </span>
                </div>

                {/* Drop zone */}
                {!isSubmitting && (
                  <div
                    ref={dropZoneRef}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
                      isDragging
                        ? "border-orange-400 bg-orange-50 dark:bg-orange-500/10"
                        : "border-gray-200 dark:border-white/[0.08] hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-500/5"
                    }`}
                  >
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-500">
                      <ImagePlus size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Arrastra o haz clic para subir
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — Máx 20 MB c/u</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                    {previews.map((src, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/[0.08]"
                      >
                        <img src={src} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                        {!isSubmitting && (
                          <button
                            onClick={() => removeFile(i)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} className="text-white" />
                          </button>
                        )}
                        {/* Etiqueta de vista */}
                        <div className="absolute bottom-1 left-1 right-1 text-center">
                          <span className="text-[9px] font-semibold text-white bg-black/60 rounded px-1 py-0.5">
                            {["Frontal", "Izquierda", "Derecha", "Trasera"][i] ?? `Vista ${i + 1}`}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Con 1 imagen se genera una vista frontal. Con 2-4 imágenes se activa Multiview para mayor precision.
                </p>
              </div>
            </div>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01]">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>

              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Box size={16} />
                    Generar modelo 3D
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
