import { useState, useEffect } from "react";
import {
  getMisCotizaciones,
  getCotizacionDetalle,
  cancelarCotizacion,
} from "../../services/clientePortalService";
import {
  FileText,
  Calendar,
  DollarSign,
  Clock,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  XCircle,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Cotizacion {
  id_cot: number;
  cod_cot: string;
  fec_cot: string;
  est_cot: string;
  total_cot: number;
  validez_dias: number;
  notas?: string;
  tipo_proyecto?: string;
  presupuesto_cliente?: number;
  detalles?: any[];
  empleado?: { nom_emp: string };
}

interface CotizacionDetalle extends Cotizacion {
  detalles: {
    id_det_cot: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    desc_personalizacion?: string;
    nombre_mueble?: string;
    mueble?: { nom_mue: string; img_mue?: string };
  }[];
}

export default function MisCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<CotizacionDetalle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchCotizaciones = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await getMisCotizaciones(page, 10);
      setCotizaciones(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar cotizaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await getCotizacionDetalle(id);
      setSelectedCotizacion(detail);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading detail:", err);
    }
  };

  const handleCancelar = async () => {
    if (!selectedCotizacion || cancelling) return;

    if (!confirm("¿Estás seguro de cancelar esta cotización?")) return;

    try {
      setCancelling(true);
      await cancelarCotizacion(selectedCotizacion.id_cot);
      setShowModal(false);
      fetchCotizaciones(pagination.current_page);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al cancelar");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "aprobada" || s === "aprobado" || s === "completada")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "rechazada" || s === "cancelada" || s === "cancelado")
      return "bg-red-100 text-red-700 border-red-200";
    if (s === "en proceso" || s === "en revisión")
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const canCancel = (status: string) => {
    const s = status.toLowerCase();
    return s === "pendiente";
  };

  // Get display value - show presupuesto if total is 0
  const getDisplayPrice = (cot: Cotizacion) => {
    if (Number(cot.total_cot) > 0) {
      return {
        value: Number(cot.total_cot),
        label: "Total",
        isPresupuesto: false,
      };
    }
    if (cot.presupuesto_cliente && Number(cot.presupuesto_cliente) > 0) {
      return {
        value: Number(cot.presupuesto_cliente),
        label: "Presupuesto",
        isPresupuesto: true,
      };
    }
    return { value: 0, label: "Por cotizar", isPresupuesto: false };
  };

  if (loading && cotizaciones.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#a67c52] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#3a2f22] flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#a67c52]" />
            Mis Cotizaciones
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Revisa el historial de tus solicitudes
          </p>
        </div>
        <Link
          to="/solicitar-cotizacion"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#a67c52] text-white rounded-xl font-medium shadow hover:bg-[#8b6914] transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Cotización
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Cards Grid */}
      {cotizaciones.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No tienes cotizaciones aún
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            Solicita tu primera cotización para ver tus proyectos aquí
          </p>
          <Link
            to="/solicitar-cotizacion"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#a67c52] text-white rounded-xl font-medium hover:bg-[#8b6914] transition"
          >
            <Plus className="w-4 h-4" />
            Solicitar Cotización
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cotizaciones.map((cot) => {
              const priceInfo = getDisplayPrice(cot);
              return (
                <div
                  key={cot.id_cot}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#f3e7d7] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-[#a67c52]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-[#3a2f22]">
                          {cot.cod_cot}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            cot.est_cot
                          )}`}
                        >
                          {cot.est_cot}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(cot.fec_cot).toLocaleDateString("es-ES")}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {priceInfo.value > 0 ? (
                            <>
                              {priceInfo.isPresupuesto && (
                                <span className="text-purple-600">~</span>
                              )}
                              Bs. {priceInfo.value.toLocaleString("es-ES")}
                              {priceInfo.isPresupuesto && (
                                <span className="text-purple-500 text-[10px]">
                                  (presup.)
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-amber-600 italic">
                              Por cotizar
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {cot.validez_dias} días
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetail(cot.id_cot)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-[#7c5e3c] text-sm font-medium hover:bg-white transition"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => fetchCotizaciones(pagination.current_page - 1)}
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
                onClick={() => fetchCotizaciones(pagination.current_page + 1)}
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

      {/* Detail Modal */}
      {showModal && selectedCotizacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#faf8f5]">
              <div>
                <h2 className="text-lg font-bold text-[#3a2f22]">
                  {selectedCotizacion.cod_cot}
                </h2>
                <p className="text-xs text-gray-500">Detalle de cotización</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Estado</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedCotizacion.est_cot
                    )}`}
                  >
                    {selectedCotizacion.est_cot}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Fecha</p>
                  <p className="font-medium text-[#3a2f22] text-sm">
                    {new Date(selectedCotizacion.fec_cot).toLocaleDateString(
                      "es-ES"
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-1">
                    {Number(selectedCotizacion.total_cot) > 0
                      ? "Total"
                      : "Presupuesto"}
                  </p>
                  <p className="font-bold text-[#a67c52] text-sm">
                    {Number(selectedCotizacion.total_cot) > 0 ? (
                      <>
                        Bs.{" "}
                        {Number(selectedCotizacion.total_cot).toLocaleString(
                          "es-ES"
                        )}
                      </>
                    ) : selectedCotizacion.presupuesto_cliente ? (
                      <>
                        ~Bs.{" "}
                        {Number(
                          selectedCotizacion.presupuesto_cliente
                        ).toLocaleString("es-ES")}
                      </>
                    ) : (
                      <span className="text-amber-600">Por cotizar</span>
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Validez</p>
                  <p className="font-medium text-[#3a2f22] text-sm">
                    {selectedCotizacion.validez_dias} días
                  </p>
                </div>
              </div>

              {/* Pending notice */}
              {selectedCotizacion.est_cot.toLowerCase() === "pendiente" &&
                Number(selectedCotizacion.total_cot) === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Tu solicitud está pendiente de revisión. Nuestro equipo te
                      enviará una cotización formal pronto.
                    </p>
                  </div>
                )}

              <h3 className="font-semibold text-[#3a2f22] mb-3 text-sm">
                Productos
              </h3>
              <div className="space-y-2">
                {selectedCotizacion.detalles?.map((det) => {
                  const isCustom =
                    det.desc_personalizacion?.includes("[PERSONALIZADO]");
                  const displayName =
                    det.nombre_mueble || det.mueble?.nom_mue || "Producto";

                  return (
                    <div
                      key={det.id_det_cot}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {det.mueble?.img_mue ? (
                        <img
                          src={det.mueble.img_mue.replace("public", "")}
                          alt={displayName}
                          className="w-12 h-12 rounded-lg object-cover bg-white"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCustom ? "bg-purple-100" : "bg-gray-200"
                          }`}
                        >
                          {isCustom ? (
                            <Sparkles className="w-5 h-5 text-purple-500" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          {isCustom && (
                            <span className="px-1 py-0.5 bg-purple-100 text-purple-700 text-[9px] rounded font-medium">
                              PERSONALIZADO
                            </span>
                          )}
                          <p className="font-medium text-[#3a2f22] text-sm truncate">
                            {displayName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {det.cantidad} x{" "}
                          {Number(det.precio_unitario) > 0 ? (
                            <>
                              Bs.{" "}
                              {Number(det.precio_unitario).toLocaleString(
                                "es-ES"
                              )}
                            </>
                          ) : (
                            <span className="italic">Por cotizar</span>
                          )}
                        </p>
                        {det.desc_personalizacion &&
                          !det.desc_personalizacion.includes(
                            "[PERSONALIZADO]"
                          ) && (
                            <p className="text-[10px] text-gray-400 truncate">
                              {det.desc_personalizacion}
                            </p>
                          )}
                      </div>
                      <p className="font-bold text-[#a67c52] text-sm">
                        {Number(det.subtotal) > 0 ? (
                          <>
                            Bs. {Number(det.subtotal).toLocaleString("es-ES")}
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              {selectedCotizacion.notas && (
                <div className="mt-5 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-800 mb-1">
                    Notas:
                  </p>
                  <p className="text-xs text-amber-700">
                    {selectedCotizacion.notas}
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-2">
              {canCancel(selectedCotizacion.est_cot) && (
                <button
                  onClick={handleCancelar}
                  disabled={cancelling}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cancelling ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancelar Cotización
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className={`py-2.5 bg-[#a67c52] text-white rounded-lg font-medium hover:bg-[#8b6914] transition text-sm ${
                  canCancel(selectedCotizacion.est_cot) ? "flex-1" : "w-full"
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
