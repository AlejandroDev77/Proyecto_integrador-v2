import { useState, useEffect, useCallback } from "react";
import {
  X,
  Factory,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Image,
} from "lucide-react";

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
  fec_fin?: string;
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
}

const getEstadoBadge = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "en proceso":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "completado":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export default function ModalProduccionInforme({
  showModal,
  setShowModal,
  produccionId,
}: Props) {
  const [produccion, setProduccion] = useState<Produccion | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduccion = useCallback(async () => {
    if (!produccionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/produccion/${produccionId}`);
      const data = await res.json();
      // Normalizar
      const normalizedData = {
        ...data,
        produccion_etapas:
          data.produccion_etapas || data.produccionEtapas || [],
        etapas_total: data.etapas_total ?? 0,
        etapas_completadas: data.etapas_completadas ?? 0,
        progreso: data.progreso ?? 0,
      };
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
    }
  }, [showModal, produccionId, fetchProduccion]);

  if (!showModal) return null;

  const progreso = produccion?.progreso ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold">Informe de Producción</h2>
                <p className="text-sm opacity-80">
                  Reporte completo del proceso
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
            </div>
          ) : !produccion ? (
            <div className="text-center py-16 text-gray-500">
              Producción no encontrada
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-5 border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <Factory className="w-6 h-6 text-cyan-600" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {produccion.cod_pro}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoBadge(
                          produccion.est_pro
                        )}`}
                      >
                        {produccion.est_pro}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      {produccion.cotizacion?.cliente?.nom_cli ||
                        produccion.venta?.cliente?.nom_cli ||
                        "Cliente no asignado"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Prioridad</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      P{produccion.prioridad}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" /> Inicio
                    </div>
                    <p className="font-semibold">{produccion.fec_ini}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" /> Fin Estimado
                    </div>
                    <p className="font-semibold">
                      {produccion.fec_fin_estimada}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" /> Fin Real
                    </div>
                    <p className="font-semibold">
                      {produccion.fec_fin || "En curso"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <User className="w-3 h-3" /> Responsable
                    </div>
                    <p className="font-semibold">
                      {produccion.empleado?.nom_emp || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progreso General */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border shadow-sm">
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-600" /> Progreso General
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          progreso >= 100
                            ? "bg-green-500"
                            : progreso >= 50
                            ? "bg-cyan-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-cyan-600">
                    {progreso}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {produccion.etapas_completadas} de {produccion.etapas_total}{" "}
                  etapas completadas
                </p>
              </div>

              {/* Detalle de Etapas */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-cyan-600" /> Detalle de
                    Etapas
                  </h4>
                </div>
                <div className="divide-y">
                  {produccion.produccion_etapas?.length === 0 ? (
                    <p className="p-4 text-center text-gray-400">
                      Sin etapas registradas
                    </p>
                  ) : (
                    produccion.produccion_etapas?.map((etapa, idx) => (
                      <div key={etapa.id_pro_eta} className="p-4">
                        <div className="flex items-start justify-between mb-2">
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
                              {etapa.est_eta === "Completado" ? "✓" : idx + 1}
                            </div>
                            <div>
                              <p className="font-medium">
                                {etapa.etapa?.nom_eta || "Etapa"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {etapa.fec_ini} → {etapa.fec_fin}
                                {etapa.empleado &&
                                  ` • ${etapa.empleado.nom_emp}`}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                              etapa.est_eta
                            )}`}
                          >
                            {etapa.est_eta}
                          </span>
                        </div>

                        {/* Evidencias de esta etapa */}
                        {etapa.evidencias?.length > 0 && (
                          <div className="mt-3 ml-11">
                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              <Image className="w-3 h-3" />{" "}
                              {etapa.evidencias.length} evidencia(s)
                            </p>
                            <div className="grid grid-cols-4 gap-2">
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
                                    className="relative cursor-pointer"
                                    onClick={() =>
                                      window.open(fileUrl, "_blank")
                                    }
                                  >
                                    {isImage ? (
                                      <img
                                        src={fileUrl}
                                        alt={evi.descripcion || "Evidencia"}
                                        className="w-full h-16 object-cover rounded-lg border"
                                      />
                                    ) : isVideo ? (
                                      <div className="w-full h-16 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                                        <svg
                                          className="w-8 h-8 text-blue-500"
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
                                      <div className="w-full h-16 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-lg border">
                                        <svg
                                          className="w-8 h-8 text-purple-500"
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
                                    <p className="text-[10px] text-gray-500 truncate mt-1">
                                      {evi.tipo_evi || "foto"}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Notas */}
              {produccion.notas && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200">
                  <h4 className="font-semibold text-sm text-yellow-700 mb-2">
                    Notas
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {produccion.notas}
                  </p>
                </div>
              )}

              {/* Resumen */}
              <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4 border border-cyan-200">
                <h4 className="font-semibold text-cyan-700 mb-2">
                  Resumen del Proceso
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-cyan-600">
                      {produccion.etapas_total}
                    </p>
                    <p className="text-xs text-gray-500">Etapas Totales</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {produccion.etapas_completadas}
                    </p>
                    <p className="text-xs text-gray-500">Completadas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {produccion.produccion_etapas?.filter(
                        (e) => e.est_eta === "En Proceso"
                      ).length || 0}
                    </p>
                    <p className="text-xs text-gray-500">En Proceso</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {produccion.produccion_etapas?.filter(
                        (e) => e.est_eta === "Pendiente"
                      ).length || 0}
                    </p>
                    <p className="text-xs text-gray-500">Pendientes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Generado: {new Date().toLocaleDateString()}
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
