import { useState, useEffect, useCallback } from "react";
import {
  Factory,
  X,
  Check,
  CheckCircle,
  Play,
  ChevronDown,
  ChevronUp,
  Loader2,
  Camera,
  Image,
  Calendar,
  User,
  Upload,
} from "lucide-react";
import Swal from "sweetalert2";

const API = "http://localhost:8080/api";

interface Evidencia {
  id_evi: number;
  archivo_evi: string;
  descripcion: string;
  fec_evi: string;
  tipo_evi?: string;
}

interface ProduccionEtapa {
  id_pro_eta: number;
  cod_pro_eta: string;
  fec_ini: string;
  fec_fin: string;
  est_eta: string;
  etapa: { nom_eta: string };
  empleado?: { nom_emp: string };
  evidencias: Evidencia[];
}

interface Produccion {
  id_pro: number;
  cod_pro: string;
  fec_ini: string;
  fec_fin_estimada: string;
  est_pro: string;
  prioridad: string;
  notas?: string;
  cotizacion?: { cod_cot: string; cliente?: { nom_cli: string } };
  venta?: { cod_ven: string; cliente?: { nom_cli: string } };
  empleado?: { id_emp: number; nom_emp: string; ap_pat_emp?: string };
  produccion_etapas: ProduccionEtapa[];
  etapas_total: number;
  etapas_completadas: number;
  progreso: number;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  produccionId: number | null;
  onUpdate?: () => void;
}

const getEstadoColor = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-700";
    case "en proceso":
      return "bg-blue-100 text-blue-700";
    case "completado":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ModalProduccionDetalle({
  showModal,
  setShowModal,
  produccionId,
  onUpdate,
}: Props) {
  const [produccion, setProduccion] = useState<Produccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedEtapa, setExpandedEtapa] = useState<number | null>(null);
  const [uploadingEtapa, setUploadingEtapa] = useState<number | null>(null);

  const fetchProduccion = useCallback(async () => {
    if (!produccionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/produccion/${produccionId}`);
      const data = await res.json();
      // Normalizar campos: Laravel puede enviar camelCase o snake_case
      const normalizedData = {
        ...data,
        produccion_etapas:
          data.produccion_etapas || data.produccionEtapas || [],
        etapas_total:
          data.etapas_total ??
          (data.produccion_etapas || data.produccionEtapas || []).length,
        etapas_completadas:
          data.etapas_completadas ??
          (data.produccion_etapas || data.produccionEtapas || []).filter(
            (e: ProduccionEtapa) => e.est_eta === "Completado"
          ).length,
        progreso: data.progreso ?? 0,
      };
      if (normalizedData.etapas_total > 0 && normalizedData.progreso === 0) {
        normalizedData.progreso = Math.round(
          (normalizedData.etapas_completadas / normalizedData.etapas_total) *
            100
        );
      }
      setProduccion(normalizedData);
    } catch {
      setProduccion(null);
    } finally {
      setLoading(false);
    }
  }, [produccionId]);

  useEffect(() => {
    if (showModal && produccionId) {
      fetchProduccion();
      setExpandedEtapa(null);
    }
  }, [showModal, produccionId, fetchProduccion]);

  const handleChangeEstado = async (
    id_pro_eta: number,
    nuevoEstado: string,
    evidenciasCount: number = 0
  ) => {
    // Validar que no se puede completar sin evidencia
    if (nuevoEstado === "Completado" && evidenciasCount === 0) {
      Swal.fire({
        icon: "warning",
        title: "Evidencia Requerida",
        text: "Debes subir al menos una evidencia antes de marcar la etapa como completada.",
        confirmButtonColor: "#06b6d4",
      });
      return;
    }

    try {
      const res = await fetch(`${API}/produccion-etapa/${id_pro_eta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ est_eta: nuevoEstado }),
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: `Etapa: ${nuevoEstado}`,
          timer: 1200,
          showConfirmButton: false,
        });
        fetchProduccion();
        onUpdate?.();
      }
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  const handleUploadEvidencia = async (
    id_pro_eta: number,
    file: File,
    descripcion: string,
    tipo: string = "foto"
  ) => {
    if (!produccion?.empleado) {
      Swal.fire("Error", "La producción no tiene empleado asignado", "error");
      return;
    }

    setUploadingEtapa(id_pro_eta);
    const formData = new FormData();
    formData.append("id_pro_eta", String(id_pro_eta));
    formData.append("archivo", file);
    formData.append("descripcion", descripcion || "Evidencia del proceso");
    formData.append("tipo_evi", tipo);
    formData.append("id_emp", String(produccion.empleado?.id_emp || 1));

    try {
      const res = await fetch(`${API}/evidencia-produccion`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Evidencia subida",
          timer: 1200,
          showConfirmButton: false,
        });
        fetchProduccion();
        onUpdate?.();
      } else {
        Swal.fire("Error", "No se pudo subir la evidencia", "error");
      }
    } catch {
      Swal.fire("Error", "Error de conexión", "error");
    } finally {
      setUploadingEtapa(null);
    }
  };

  const showUploadDialog = (id_pro_eta: number, etapaNombre: string) => {
    Swal.fire({
      title: `Subir Evidencia`,
      html: `
        <div class="text-left">
          <div class="flex items-center gap-2 mb-4 pb-3 border-b">
            <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span class="text-sm text-gray-600">Etapa: <strong class="text-gray-900">${etapaNombre}</strong></span>
          </div>
          
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de evidencia *</label>
          <div class="grid grid-cols-3 gap-2 mb-4">
            <label class="cursor-pointer">
              <input type="radio" name="tipo_evi" value="foto" class="hidden peer" checked />
              <div class="p-3 border-2 rounded-xl text-center peer-checked:border-cyan-500 peer-checked:bg-cyan-50 hover:bg-gray-50 transition-all">
                <svg class="w-8 h-8 mx-auto mb-1 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-xs font-medium">Foto</span>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="tipo_evi" value="video" class="hidden peer" />
              <div class="p-3 border-2 rounded-xl text-center peer-checked:border-cyan-500 peer-checked:bg-cyan-50 hover:bg-gray-50 transition-all">
                <svg class="w-8 h-8 mx-auto mb-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span class="text-xs font-medium">Video</span>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="tipo_evi" value="documento" class="hidden peer" />
              <div class="p-3 border-2 rounded-xl text-center peer-checked:border-cyan-500 peer-checked:bg-cyan-50 hover:bg-gray-50 transition-all">
                <svg class="w-8 h-8 mx-auto mb-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="text-xs font-medium">Documento</span>
              </div>
            </label>
          </div>
          
          <label class="block text-sm font-medium text-gray-700 mb-2">Archivo *</label>
          <div id="drop-zone" class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-cyan-400 transition-colors mb-4 cursor-pointer">
            <input type="file" id="swal-file" class="hidden" />
            <svg id="upload-icon" class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-sm text-gray-600 font-medium">Click o arrastra archivo aquí</p>
            <p id="file-hint" class="text-xs text-gray-400 mt-1">JPG, PNG • Máx 50MB</p>
            <p id="file-name" class="text-sm text-cyan-600 mt-2 hidden font-medium"></p>
          </div>
          
          <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea 
            id="swal-desc" 
            class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none" 
            rows="2"
            placeholder="Describe brevemente el avance..."
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Subir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#6b7280",
      width: 450,
      didOpen: () => {
        const fileInput = document.getElementById(
          "swal-file"
        ) as HTMLInputElement;
        const dropZone = document.getElementById("drop-zone");
        const fileName = document.getElementById("file-name");
        const fileHint = document.getElementById("file-hint");
        const uploadIcon = document.getElementById("upload-icon");
        const radioButtons = document.querySelectorAll(
          'input[name="tipo_evi"]'
        );

        // File type hints
        const updateHint = () => {
          const selected = document.querySelector(
            'input[name="tipo_evi"]:checked'
          ) as HTMLInputElement;
          if (selected && fileHint) {
            const hints: Record<string, string> = {
              foto: "JPG, PNG, GIF • Máx 50MB",
              video: "MP4, MOV, AVI • Máx 50MB",
              documento: "PDF, DOC, XLS • Máx 50MB",
            };
            const accepts: Record<string, string> = {
              foto: "image/*",
              video: "video/*",
              documento: ".pdf,.doc,.docx,.xls,.xlsx",
            };
            fileHint.textContent = hints[selected.value] || "";
            fileInput.accept = accepts[selected.value] || "*/*";
          }
        };
        radioButtons.forEach((r) => r.addEventListener("change", updateHint));

        // Click to upload
        dropZone?.addEventListener("click", () => fileInput?.click());

        // File selection
        fileInput?.addEventListener("change", () => {
          if (fileInput.files?.[0] && fileName && uploadIcon) {
            fileName.textContent = fileInput.files[0].name;
            fileName.classList.remove("hidden");
            uploadIcon.classList.add("text-cyan-500");
          }
        });
      },
      preConfirm: () => {
        const f = document.getElementById("swal-file") as HTMLInputElement;
        const d = document.getElementById("swal-desc") as HTMLTextAreaElement;
        const t = document.querySelector(
          'input[name="tipo_evi"]:checked'
        ) as HTMLInputElement;
        if (!f.files?.[0]) {
          Swal.showValidationMessage("Selecciona un archivo");
          return false;
        }
        return {
          file: f.files[0],
          descripcion: d.value,
          tipo: t?.value || "foto",
        };
      },
    }).then((r) => {
      if (r.isConfirmed && r.value) {
        handleUploadEvidencia(
          id_pro_eta,
          r.value.file,
          r.value.descripcion,
          r.value.tipo
        );
      }
    });
  };

  if (!showModal) return null;

  const progreso = produccion?.progreso ?? 0;
  const progresoColor =
    progreso >= 70
      ? "bg-emerald-500"
      : progreso >= 30
      ? "bg-cyan-500"
      : "bg-yellow-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-cyan-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Factory className="w-6 h-6 text-white" />
            <div className="text-white">
              <h2 className="text-lg font-bold">
                {loading ? "..." : produccion?.cod_pro}
              </h2>
              <p className="text-sm opacity-80">
                {produccion?.cotizacion?.cliente?.nom_cli ||
                  produccion?.venta?.cliente?.nom_cli ||
                  "Producción"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
            </div>
          ) : !produccion ? (
            <div className="text-center py-12 text-gray-500">No encontrada</div>
          ) : (
            <div className="space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Calendar className="w-3 h-3" />
                    Inicio
                  </div>
                  <p className="text-sm font-medium">{produccion.fec_ini}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Calendar className="w-3 h-3" />
                    Fin Est.
                  </div>
                  <p className="text-sm font-medium">
                    {produccion.fec_fin_estimada}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <User className="w-3 h-3" />
                    Responsable
                  </div>
                  <p className="text-sm font-medium">
                    {produccion.empleado?.nom_emp || "-"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Estado</div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                      produccion.est_pro
                    )}`}
                  >
                    {produccion.est_pro}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-lg font-bold text-cyan-600">
                    {progreso}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progresoColor} transition-all`}
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {produccion.etapas_completadas} de {produccion.etapas_total}{" "}
                  etapas
                </p>
              </div>

              {/* Etapas */}
              <div>
                <h3 className="font-semibold mb-3">Etapas de Producción</h3>
                <div className="space-y-2">
                  {produccion.produccion_etapas?.map((etapa, idx) => (
                    <div
                      key={etapa.id_pro_eta}
                      className="border rounded-xl overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        onClick={() =>
                          setExpandedEtapa(
                            expandedEtapa === etapa.id_pro_eta
                              ? null
                              : etapa.id_pro_eta
                          )
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              etapa.est_eta === "Completado"
                                ? "bg-green-100 text-green-600"
                                : etapa.est_eta === "En Proceso"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {etapa.est_eta === "Completado" ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {etapa.etapa?.nom_eta}
                            </p>
                            <p className="text-xs text-gray-500">
                              {etapa.fec_ini} → {etapa.fec_fin}
                              {etapa.evidencias?.length > 0 && (
                                <span className="ml-2 text-cyan-600">
                                  • {etapa.evidencias.length} fotos
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(
                              etapa.est_eta
                            )}`}
                          >
                            {etapa.est_eta}
                          </span>
                          {expandedEtapa === etapa.id_pro_eta ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {expandedEtapa === etapa.id_pro_eta && (
                        <div className="p-3 pt-0 border-t bg-gray-50 dark:bg-gray-900/30">
                          <div className="flex gap-2 flex-wrap mb-3">
                            {etapa.est_eta === "Pendiente" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeEstado(
                                    etapa.id_pro_eta,
                                    "En Proceso"
                                  );
                                }}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-1"
                              >
                                <Play className="w-3 h-3" /> Iniciar
                              </button>
                            )}
                            {etapa.est_eta === "En Proceso" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeEstado(
                                    etapa.id_pro_eta,
                                    "Completado",
                                    etapa.evidencias?.length || 0
                                  );
                                }}
                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" /> Completar
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showUploadDialog(
                                  etapa.id_pro_eta,
                                  etapa.etapa?.nom_eta || "Etapa"
                                );
                              }}
                              disabled={uploadingEtapa === etapa.id_pro_eta}
                              className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
                            >
                              {uploadingEtapa === etapa.id_pro_eta ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Camera className="w-3 h-3" />
                              )}
                              Subir Evidencia
                            </button>
                          </div>

                          {etapa.evidencias?.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                              {etapa.evidencias.map((evi) => {
                                const isImage =
                                  evi.tipo_evi === "foto" ||
                                  (!evi.tipo_evi &&
                                    evi.archivo_evi?.match(
                                      /\.(jpg|jpeg|png|gif|webp)$/i
                                    ));
                                const isVideo =
                                  evi.tipo_evi === "video" ||
                                  evi.archivo_evi?.match(
                                    /\.(mp4|mov|avi|webm)$/i
                                  );
                                const fileUrl = evi.archivo_evi?.startsWith(
                                  "http"
                                )
                                  ? evi.archivo_evi
                                  : `http://localhost:8080/storage/${evi.archivo_evi}`;

                                return (
                                  <div
                                    key={evi.id_evi}
                                    className="relative group rounded-lg overflow-hidden border cursor-pointer bg-gray-100 dark:bg-gray-800"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isImage) {
                                        Swal.fire({
                                          imageUrl: fileUrl,
                                          title: evi.descripcion || "Evidencia",
                                          text: evi.fec_evi,
                                          showConfirmButton: false,
                                          showCloseButton: true,
                                        });
                                      } else {
                                        window.open(fileUrl, "_blank");
                                      }
                                    }}
                                  >
                                    {isImage ? (
                                      <img
                                        src={fileUrl}
                                        alt="Evidencia"
                                        className="w-full h-20 object-cover"
                                      />
                                    ) : isVideo ? (
                                      <div className="w-full h-20 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                        <svg
                                          className="w-10 h-10 text-blue-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                          />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="w-full h-20 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20">
                                        <svg
                                          className="w-10 h-10 text-purple-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                      {isImage ? (
                                        <Image className="w-5 h-5 text-white" />
                                      ) : (
                                        <Upload className="w-5 h-5 text-white" />
                                      )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 p-1 truncate">
                                      {evi.tipo_evi || "foto"} • {evi.fec_evi}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic flex items-center gap-2">
                              <Camera className="w-4 h-4" /> Sin evidencias -
                              sube fotos del proceso
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-gray-50 px-4 py-3 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
