import { useState, useEffect } from "react";
import {
  getMisPedidos,
  getPedidoDetalle,
} from "../../services/clientePortalService";
import {
  Package,
  Calendar,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  Truck,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Pedido {
  id_ven: number;
  cod_ven: string;
  fec_ven: string;
  est_ven: string;
  total_ven: number;
  notas?: string;
  empleado?: { nom_emp: string };
}

interface PedidoDetalle extends Pedido {
  detalles: {
    id_det_ven: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    mueble?: { nom_mue: string; img_mue?: string };
  }[];
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [selectedPedido, setSelectedPedido] = useState<PedidoDetalle | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const fetchPedidos = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await getMisPedidos(page, 10);
      setPedidos(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await getPedidoDetalle(id);
      setSelectedPedido(detail);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading detail:", err);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completado" || s === "entregado")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "cancelado") return "bg-red-100 text-red-700 border-red-200";
    if (s === "en producción" || s === "en proceso")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "enviado" || s === "en camino")
      return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completado" || s === "entregado")
      return <CheckCircle className="w-5 h-5" />;
    if (s === "enviado" || s === "en camino")
      return <Truck className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  if (loading && pedidos.length === 0) {
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
          <Package className="w-6 h-6 text-[#a67c52]" />
          Mis Pedidos
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Sigue el estado de tus compras
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      {pedidos.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No tienes pedidos aún
          </h3>
          <p className="text-gray-400 text-sm">Tus compras aparecerán aquí</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {pedidos.map((ped) => (
              <div
                key={ped.id_ven}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                    {getStatusIcon(ped.est_ven)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[#3a2f22]">
                        {ped.cod_ven}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          ped.est_ven
                        )}`}
                      >
                        {ped.est_ven}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(ped.fec_ven).toLocaleDateString("es-ES")}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        Bs. {Number(ped.total_ven).toLocaleString("es-ES")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetail(ped.id_ven)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-[#7c5e3c] text-sm font-medium hover:bg-white transition"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => fetchPedidos(pagination.current_page - 1)}
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
                onClick={() => fetchPedidos(pagination.current_page + 1)}
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

      {showModal && selectedPedido && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-blue-50">
              <div>
                <h2 className="text-lg font-bold text-[#3a2f22]">
                  {selectedPedido.cod_ven}
                </h2>
                <p className="text-xs text-gray-500">Detalle de pedido</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Estado</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedPedido.est_ven
                    )}`}
                  >
                    {selectedPedido.est_ven}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Fecha</p>
                  <p className="font-medium text-[#3a2f22] text-sm">
                    {new Date(selectedPedido.fec_ven).toLocaleDateString(
                      "es-ES"
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="font-bold text-[#a67c52] text-sm">
                    Bs.{" "}
                    {Number(selectedPedido.total_ven).toLocaleString("es-ES")}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-[#3a2f22] mb-3 text-sm">
                Productos
              </h3>
              <div className="space-y-2">
                {selectedPedido.detalles?.map((det) => (
                  <div
                    key={det.id_det_ven}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {det.mueble?.img_mue ? (
                      <img
                        src={det.mueble.img_mue.replace("public", "")}
                        alt={det.mueble?.nom_mue}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#3a2f22] text-sm truncate">
                        {det.mueble?.nom_mue || "Producto"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {det.cantidad} x Bs.{" "}
                        {Number(det.precio_unitario).toLocaleString("es-ES")}
                      </p>
                    </div>
                    <p className="font-bold text-[#a67c52] text-sm">
                      Bs. {Number(det.subtotal).toLocaleString("es-ES")}
                    </p>
                  </div>
                ))}
              </div>

              {selectedPedido.notas && (
                <div className="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-medium text-blue-800 mb-1">
                    Notas:
                  </p>
                  <p className="text-xs text-blue-700">
                    {selectedPedido.notas}
                  </p>
                </div>
              )}
            </div>

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
    </>
  );
}
