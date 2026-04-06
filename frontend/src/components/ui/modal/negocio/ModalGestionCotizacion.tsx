import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FileText,
  X,
  Check,
  XCircle,
  Package,
  DollarSign,
  User,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface Detalle {
  id_det_cot: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  desc_personalizacion?: string;
  nombre_mueble?: string;
  tipo_mueble?: string;
  dimensiones?: string;
  material_principal?: string;
  color_acabado?: string;
  herrajes?: string;
  img_referencia?: string;
  mueble?: {
    id_mue: number;
    nom_mue: string;
    img_mue?: string;
    precio_mue?: number;
  };
}

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
  plazo_esperado?: number;
  direccion_instalacion?: string;
  cliente?: {
    nom_cli: string;
    ap_pat_cli: string;
    ap_mat_cli?: string;
    tel_cli?: string;
    email?: string;
  };
  empleado?: { nom_emp: string; ap_pat_emp: string };
  detalles?: Detalle[];
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  cotizacion: Cotizacion | null;
  onUpdate?: () => void;
}

const API = "http://localhost:8080/api";

export default function ModalGestionCotizacion({
  showModal,
  setShowModal,
  cotizacion,
  onUpdate,
}: Props) {
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [notasAdmin, setNotasAdmin] = useState("");
  const [loading, setLoading] = useState(false);
  const [cotizacionData, setCotizacionData] = useState<Cotizacion | null>(null);

  // Fetch cotizacion with details when modal opens
  useEffect(() => {
    const fetchCotizacionDetalle = async () => {
      if (!cotizacion?.id_cot || !showModal) return;

      setLoading(true);
      try {
        const res = await fetch(`${API}/cotizacion/${cotizacion.id_cot}`);
        const data = await res.json();

        // Handle both direct response and wrapped response
        const cot = data.data || data;
        setCotizacionData(cot);

        if (cot.detalles && cot.detalles.length > 0) {
          setDetalles(cot.detalles.map((d: Detalle) => ({ ...d })));
        } else {
          setDetalles([]);
        }
        setDescuento(cot.descuento || 0);
        setNotasAdmin("");
      } catch (error) {
        console.error("Error fetching cotizacion details:", error);
        setDetalles([]);
      } finally {
        setLoading(false);
      }
    };

    if (showModal && cotizacion) {
      fetchCotizacionDetalle();
    }
  }, [cotizacion?.id_cot, showModal]);

  if (!showModal || !cotizacion) return null;

  // Use fetched data if available, otherwise fall back to prop
  const displayCotizacion = cotizacionData || cotizacion;

  const handleClose = () => setShowModal(false);

  const updatePrecio = (id: number, precio: number) => {
    setDetalles((prev) =>
      prev.map((d) =>
        d.id_det_cot === id
          ? { ...d, precio_unitario: precio, subtotal: precio * d.cantidad }
          : d
      )
    );
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, d) => sum + d.subtotal, 0) - descuento;
  };

  const handleAprobar = async () => {
    // Validate all items have prices
    const sinPrecio = detalles.filter((d) => Number(d.precio_unitario) === 0);
    if (sinPrecio.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Precios faltantes",
        text: "Debe establecer precio para todos los productos antes de aprobar.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${API}/negocio/cotizacion/${cotizacion.id_cot}/aprobar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            detalles: detalles.map((d) => ({
              id_det_cot: d.id_det_cot,
              precio_unitario: d.precio_unitario,
            })),
            descuento,
            notas_admin: notasAdmin,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al aprobar");

      Swal.fire({
        icon: "success",
        title: "¡Cotización Aprobada!",
        text: `Se ha aprobado la cotización ${cotizacion.cod_cot}`,
        timer: 2000,
      });
      onUpdate?.();
      handleClose();
    } catch (e: any) {
      Swal.fire({ icon: "error", title: "Error", text: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRechazar = async () => {
    const { value: motivo } = await Swal.fire({
      title: "¿Rechazar cotización?",
      input: "textarea",
      inputLabel: "Motivo del rechazo (opcional)",
      inputPlaceholder: "Ingrese el motivo...",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Rechazar",
      cancelButtonText: "Cancelar",
    });

    if (motivo === undefined) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${API}/negocio/cotizacion/${cotizacion.id_cot}/rechazar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivo }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al rechazar");

      Swal.fire({
        icon: "info",
        title: "Cotización Rechazada",
        timer: 2000,
      });
      onUpdate?.();
      handleClose();
    } catch (e: any) {
      Swal.fire({ icon: "error", title: "Error", text: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPendiente = displayCotizacion.est_cot.toLowerCase() === "pendiente";
  const isPersonalizado = (d: Detalle) =>
    d.desc_personalizacion?.includes("[PERSONALIZADO]") ||
    d.tipo_mueble ||
    d.nombre_mueble;
  const getProductName = (d: Detalle) =>
    d.nombre_mueble || d.mueble?.nom_mue || "Producto";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Gestión de Cotización
            </h2>
            <p className="text-white/80 text-sm">{displayCotizacion.cod_cot}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500">Cargando detalles...</p>
            </div>
          ) : (
            <>
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    displayCotizacion.est_cot.toLowerCase() === "aprobado"
                      ? "bg-green-100 text-green-700"
                      : displayCotizacion.est_cot.toLowerCase() ===
                          "rechazado" ||
                        displayCotizacion.est_cot.toLowerCase() === "cancelado"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {displayCotizacion.est_cot}
                </span>
                <span className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(displayCotizacion.fec_cot).toLocaleDateString(
                    "es-ES"
                  )}
                </span>
              </div>

              {/* Client Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Cliente
                </h3>
                <p className="font-medium">
                  {displayCotizacion.cliente?.nom_cli}{" "}
                  {displayCotizacion.cliente?.ap_pat_cli}{" "}
                  {displayCotizacion.cliente?.ap_mat_cli}
                </p>
                {displayCotizacion.cliente?.tel_cli && (
                  <p className="text-sm text-gray-500">
                    {displayCotizacion.cliente.tel_cli}
                  </p>
                )}
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {displayCotizacion.tipo_proyecto && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Tipo Proyecto</p>
                    <p className="font-medium text-blue-700 dark:text-blue-300 capitalize">
                      {displayCotizacion.tipo_proyecto}
                    </p>
                  </div>
                )}
                {displayCotizacion.presupuesto_cliente && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      Presupuesto Cliente
                    </p>
                    <p className="font-medium text-purple-700 dark:text-purple-300">
                      Bs.{" "}
                      {Number(
                        displayCotizacion.presupuesto_cliente
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
                {displayCotizacion.plazo_esperado && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Plazo Esperado</p>
                    <p className="font-medium text-green-700 dark:text-green-300">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {displayCotizacion.plazo_esperado} días
                    </p>
                  </div>
                )}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Validez</p>
                  <p className="font-medium">
                    {displayCotizacion.validez_dias} días
                  </p>
                </div>
              </div>

              {displayCotizacion.direccion_instalacion && (
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{displayCotizacion.direccion_instalacion}</span>
                </div>
              )}

              {/* Products */}
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Productos ({detalles.length})
              </h3>
              <div className="space-y-4 mb-4">
                {detalles.map((det) => (
                  <div
                    key={det.id_det_cot}
                    className={`rounded-xl border overflow-hidden ${
                      isPersonalizado(det)
                        ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {/* Product Header */}
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        {det.mueble?.img_mue ? (
                          <img
                            src={det.mueble.img_mue.replace("public", "")}
                            alt={getProductName(det)}
                            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                          />
                        ) : det.img_referencia ? (
                          <img
                            src={det.img_referencia}
                            alt="Imagen de referencia"
                            className="w-20 h-20 rounded-lg object-cover border border-purple-200"
                          />
                        ) : (
                          <div
                            className={`w-20 h-20 rounded-lg flex items-center justify-center ${
                              isPersonalizado(det)
                                ? "bg-purple-200"
                                : "bg-gray-200"
                            }`}
                          >
                            {isPersonalizado(det) ? (
                              <Sparkles className="w-8 h-8 text-purple-600" />
                            ) : (
                              <Package className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                        )}

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {isPersonalizado(det) ? (
                              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> PERSONALIZADO
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                                CATÁLOGO
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-lg text-gray-900 dark:text-white">
                            {getProductName(det)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Cantidad: <strong>{det.cantidad}</strong> unidad(es)
                          </p>
                          {det.mueble?.precio_mue && (
                            <p className="text-xs text-gray-400">
                              Precio catálogo: Bs.{" "}
                              {Number(det.mueble.precio_mue).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Personalization Details - Always show if exists */}
                    {(det.tipo_mueble ||
                      det.dimensiones ||
                      det.material_principal ||
                      det.color_acabado ||
                      det.herrajes ||
                      det.desc_personalizacion) && (
                      <div className="bg-white dark:bg-gray-800 border-t border-purple-200 dark:border-purple-700 p-4">
                        <p className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> DETALLES DE
                          PERSONALIZACIÓN
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {det.tipo_mueble && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                              <span className="text-xs text-gray-500 block">
                                Tipo:
                              </span>
                              <span className="font-medium">
                                {det.tipo_mueble}
                              </span>
                            </div>
                          )}
                          {det.dimensiones && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                              <span className="text-xs text-gray-500 block">
                                Dimensiones:
                              </span>
                              <span className="font-medium">
                                {det.dimensiones}
                              </span>
                            </div>
                          )}
                          {det.material_principal && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                              <span className="text-xs text-gray-500 block">
                                Material:
                              </span>
                              <span className="font-medium">
                                {det.material_principal}
                              </span>
                            </div>
                          )}
                          {det.color_acabado && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                              <span className="text-xs text-gray-500 block">
                                Color/Acabado:
                              </span>
                              <span className="font-medium">
                                {det.color_acabado}
                              </span>
                            </div>
                          )}
                          {det.herrajes && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                              <span className="text-xs text-gray-500 block">
                                Herrajes:
                              </span>
                              <span className="font-medium">
                                {det.herrajes}
                              </span>
                            </div>
                          )}
                        </div>
                        {det.desc_personalizacion && (
                          <div className="mt-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2 border border-purple-100 dark:border-purple-800">
                            <span className="text-xs text-gray-500 block mb-1">
                              Descripción adicional:
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {det.desc_personalizacion
                                .replace("[PERSONALIZADO]", "")
                                .split(" | ")
                                .filter((p) => p.trim())
                                .join(", ")}
                            </p>
                          </div>
                        )}
                        {det.img_referencia && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500 block mb-1">
                              Imagen de referencia:
                            </span>
                            <a
                              href={det.img_referencia}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-purple-600 hover:underline"
                            >
                              Ver imagen de referencia →
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            Precio Unitario:
                          </span>
                        </div>
                        {isPendiente ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={det.precio_unitario}
                              onChange={(e) =>
                                updatePrecio(
                                  det.id_det_cot,
                                  Number(e.target.value)
                                )
                              }
                              className="w-32 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-right font-medium"
                              min="0"
                              step="0.01"
                            />
                            <span className="text-sm text-gray-500">Bs.</span>
                          </div>
                        ) : (
                          <span className="font-medium text-lg">
                            Bs. {Number(det.precio_unitario).toLocaleString()}
                          </span>
                        )}
                        <span className="text-lg font-bold text-amber-600 ml-auto">
                          Subtotal: Bs. {Number(det.subtotal).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount & Notes (only for pending) */}
              {isPendiente && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Descuento (Bs.)
                    </label>
                    <input
                      type="number"
                      value={descuento}
                      onChange={(e) => setDescuento(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Notas del administrador
                    </label>
                    <input
                      type="text"
                      value={notasAdmin}
                      onChange={(e) => setNotasAdmin(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Notas internas..."
                    />
                  </div>
                </div>
              )}

              {/* Client Notes */}
              {displayCotizacion.notas && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200">
                  <p className="text-sm font-medium text-amber-800 mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Notas del cliente:
                  </p>
                  <p className="text-sm text-amber-700">
                    {displayCotizacion.notas}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-600">Total:</span>
            <span className="text-2xl font-bold text-amber-600">
              Bs. {calcularTotal().toLocaleString()}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-xl font-medium transition hover:bg-gray-300"
            >
              Cerrar
            </button>

            {isPendiente && (
              <>
                <button
                  onClick={handleRechazar}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition"
                >
                  <XCircle className="w-5 h-5" />
                  Rechazar
                </button>
                <button
                  onClick={handleAprobar}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-xl font-medium transition"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  Aprobar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
