import { useState, useEffect } from "react";
import {
  getMisProducciones,
  getProduccionDetalle,
} from "../../services/clientePortalService";
import {
  Factory,
  Calendar,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";

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
  etapa?: { nom_eta: string };
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
  cotizacion?: { cod_cot: string };
  venta?: { cod_ven: string };
  produccion_etapas?: ProduccionEtapa[];
  etapas_total: number;
  etapas_completadas: number;
  progreso: number;
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

const getFileUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:8080/storage/${path}`;
};

export default function MisProducciones() {
  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [selectedProduccion, setSelectedProduccion] =
    useState<Produccion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedEtapa, setExpandedEtapa] = useState<number | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const fetchProducciones = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await getMisProducciones(page, 10);
      setProducciones(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar producciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducciones();
  }, []);

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await getProduccionDetalle(id);
      setSelectedProduccion(detail);
      setShowModal(true);
      setExpandedEtapa(null);
    } catch (err) {
      console.error("Error loading detail:", err);
    }
  };

  if (loading && producciones.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#a67c52] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#3a2f22] flex items-center gap-3">
          <Factory className="w-6 h-6 text-[#a67c52]" />
          Mis Producciones
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Sigue el progreso de fabricación de tus muebles
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {producciones.length === 0 ? (
        <div className="text-center py-12">
          <Factory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No tienes producciones activas
          </h3>
          <p className="text-gray-400 text-sm">
            Cuando tengas un pedido en fabricación, aparecerá aquí
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {producciones.map((prod) => (
              <div
                key={prod.id_pro}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Progress Circle */}
                  <div className="w-14 h-14 rounded-full bg-white border-4 border-[#a67c52] flex items-center justify-center shrink-0 relative">
                    <span className="text-sm font-bold text-[#a67c52]">
                      {prod.progreso}%
                    </span>
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#a67c52"
                        strokeWidth="8"
                        strokeDasharray={`${prod.progreso * 2.64} 264`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[#3a2f22]">
                        {prod.cod_pro}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                          prod.est_pro
                        )}`}
                      >
                        {prod.est_pro}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Inicio: {prod.fec_ini}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Estimado: {prod.fec_fin_estimada}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {prod.etapas_completadas}/{prod.etapas_total} etapas
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#a67c52] transition-all"
                        style={{ width: `${prod.progreso}%` }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleViewDetail(prod.id_pro)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-[#7c5e3c] text-sm font-medium hover:bg-white transition"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Etapas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => fetchProducciones(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm disabled:opacity-50 hover:bg-gray-200 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <span className="text-xs text-gray-500">
                {pagination.current_page} / {pagination.last_page}
              </span>
              <button
                onClick={() => fetchProducciones(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm disabled:opacity-50 hover:bg-gray-200 transition"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Production Detail Modal */}
      {showModal && selectedProduccion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#a67c52] text-white">
              <div className="flex items-center gap-3">
                <Factory className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-bold">
                    {selectedProduccion.cod_pro}
                  </h2>
                  <p className="text-sm opacity-80">Progreso de fabricación</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {/* Progress Overview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Progreso Total
                  </span>
                  <span className="text-xl font-bold text-[#a67c52]">
                    {selectedProduccion.progreso}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#a67c52] transition-all"
                    style={{ width: `${selectedProduccion.progreso}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedProduccion.etapas_completadas} de{" "}
                  {selectedProduccion.etapas_total} etapas completadas
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Fecha Inicio</p>
                  <p className="font-medium text-[#3a2f22] text-sm">
                    {selectedProduccion.fec_ini}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Fecha Estimada</p>
                  <p className="font-medium text-[#3a2f22] text-sm">
                    {selectedProduccion.fec_fin_estimada}
                  </p>
                </div>
              </div>

              {/* Stages */}
              <h3 className="font-semibold text-[#3a2f22] mb-3 text-sm">
                Etapas de Fabricación
              </h3>
              <div className="space-y-2">
                {selectedProduccion.produccion_etapas?.map((etapa, idx) => (
                  <div
                    key={etapa.id_pro_eta}
                    className="border rounded-xl overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
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
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {etapa.etapa?.nom_eta || `Etapa ${idx + 1}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {etapa.fec_ini} → {etapa.fec_fin}
                            {etapa.evidencias?.length > 0 && (
                              <span className="ml-2 text-[#a67c52]">
                                • {etapa.evidencias.length} fotos
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${getEstadoColor(
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

                    {/* Expanded Evidence */}
                    {expandedEtapa === etapa.id_pro_eta && (
                      <div className="p-3 pt-0 border-t bg-gray-50">
                        {etapa.evidencias?.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {etapa.evidencias.map((evi) => {
                              const isImage =
                                evi.tipo_evi === "foto" ||
                                (!evi.tipo_evi &&
                                  evi.archivo_evi?.match(
                                    /\.(jpg|jpeg|png|gif|webp)$/i
                                  ));
                              const fileUrl = getFileUrl(evi.archivo_evi);

                              return (
                                <div
                                  key={evi.id_evi}
                                  className="relative group rounded-lg overflow-hidden border cursor-pointer bg-white"
                                  onClick={() =>
                                    isImage
                                      ? setViewingImage(fileUrl)
                                      : window.open(fileUrl, "_blank")
                                  }
                                >
                                  {isImage ? (
                                    <img
                                      src={fileUrl}
                                      alt="Evidencia"
                                      className="w-full h-16 object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-16 flex items-center justify-center bg-purple-50">
                                      <ImageIcon className="w-6 h-6 text-purple-400" />
                                    </div>
                                  )}
                                  <p className="text-[10px] text-gray-500 p-1 truncate">
                                    {evi.fec_evi}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic py-2">
                            Esta etapa aún no tiene evidencias
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 bg-[#a67c52] text-white rounded-lg font-medium hover:bg-[#8b6914] transition text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={() => setViewingImage(null)}
        >
          <img
            src={viewingImage}
            alt="Evidencia"
            className="max-w-full max-h-full rounded-lg"
          />
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
