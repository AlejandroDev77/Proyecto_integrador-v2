import { useState, useEffect } from "react";
import {
  ShoppingCart,
  FileText,
  RotateCcw,
  Package,
  ArrowRight,
  Store,
  Factory,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Bell,
  Settings,
  User,
} from "lucide-react";

// Importar los modales
import ModalVentaCompleta from "../../ui/modal/negocio/ModalVentaCompleta";
import ModalCotizacionCompleta from "../../ui/modal/negocio/ModalCotizacionCompleta";
import ModalCotizacionAVenta from "../../ui/modal/negocio/ModalCotizacionAVenta";
import ModalDevolucion from "../../ui/modal/negocio/ModalDevolucion";
import ModalCompraCompleta from "../../ui/modal/negocio/ModalCompraCompleta";
import ModalProduccionCompleta from "../../ui/modal/negocio/ModalProduccionCompleta";
import ModalProduccionDetalle from "../../ui/modal/negocio/ModalProduccionDetalle";
import ModalProduccionInforme from "../../ui/modal/negocio/ModalProduccionInforme";
import ModalGestionCotizacion from "../../ui/modal/negocio/ModalGestionCotizacion";

interface IProcessCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface Cotizacion {
  id_cot: number;
  cod_cot: string;
  fec_cot: string;
  est_cot: string;
  total_cot: number;
  validez_dias: number;
  presupuesto_cliente?: number;
  tipo_proyecto?: string;
  notas?: string;
  cliente?: { nom_cli: string; ap_pat_cli?: string };
  detalles?: any[];
}

interface Produccion {
  id_pro: number;
  cod_pro: string;
  fec_ini: string;
  fec_fin_estimada: string;
  est_pro: string;
  prioridad: string;
  cotizacion?: { cod_cot: string; cliente?: { nom_cli: string } };
  venta?: { cod_ven: string; cliente?: { nom_cli: string } };
  empleado?: { nom_emp: string; ap_pat_emp?: string };
}

const API = "http://localhost:8000/api";

const processes: IProcessCard[] = [
  {
    id: "venta",
    title: "Nueva Venta",
    description:
      "Registra una venta directa seleccionando los productos disponibles.",
    icon: <ShoppingCart className="w-6 h-6" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "cotizacion-nueva",
    title: "Nueva Cotización",
    description: "Crea una cotización para un cliente con productos y precios.",
    icon: <FileText className="w-6 h-6" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "cotizacion",
    title: "Cotización a Venta",
    description: "Convierte una cotización aprobada en una venta.",
    icon: <FileText className="w-6 h-6" />,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  {
    id: "produccion",
    title: "Iniciar Producción",
    description: "Crea una orden de producción con muebles y asigna etapas.",
    icon: <Factory className="w-6 h-6" />,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
  {
    id: "devolucion",
    title: "Devolución",
    description: "Procesa la devolución de productos de una venta.",
    icon: <RotateCcw className="w-6 h-6" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    id: "compra",
    title: "Compra de Materiales",
    description: "Registra la compra de materiales a un proveedor.",
    icon: <Package className="w-6 h-6" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
];

function ProcessCardItem({
  process,
  onStart,
}: {
  process: IProcessCard;
  onStart: () => void;
}) {
  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-xl border ${process.borderColor} hover:shadow-lg transition-all duration-300 overflow-hidden`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${process.bgColor} ${process.color}`}>
            {process.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {process.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {process.description}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={onStart}
          className={`w-full py-2.5 px-4 ${process.bgColor} ${process.color} hover:opacity-80 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
        >
          Iniciar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

const getEstadoColor = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "en proceso":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completado":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "cancelado":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getEstadoIcon = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "pendiente":
      return <Clock className="w-4 h-4" />;
    case "en proceso":
      return <Loader2 className="w-4 h-4 animate-spin" />;
    case "completado":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export default function Negocio() {
  const [showVentaModal, setShowVentaModal] = useState(false);
  const [showCotizacionModal, setShowCotizacionModal] = useState(false);
  const [showCotizacionNuevaModal, setShowCotizacionNuevaModal] =
    useState(false);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);
  const [showCompraModal, setShowCompraModal] = useState(false);
  const [showProduccionModal, setShowProduccionModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showInformeModal, setShowInformeModal] = useState(false);
  const [showGestionModal, setShowGestionModal] = useState(false);
  const [selectedProduccionId, setSelectedProduccionId] = useState<
    number | null
  >(null);
  const [selectedInformeId, setSelectedInformeId] = useState<number | null>(
    null
  );
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);

  // Cotizaciones pendientes
  const [cotizacionesPendientes, setCotizacionesPendientes] = useState<
    Cotizacion[]
  >([]);
  const [loadingCot, setLoadingCot] = useState(false);

  // Estados por categoría
  const [prodPendientes, setProdPendientes] = useState<Produccion[]>([]);
  const [prodEnProceso, setProdEnProceso] = useState<Produccion[]>([]);
  const [prodCompletados, setProdCompletados] = useState<Produccion[]>([]);
  const [loadingProd, setLoadingProd] = useState(false);

  // Acordeones abiertos/cerrados
  const [accordionOpen, setAccordionOpen] = useState({
    pendiente: true,
    enProceso: true,
    completado: false,
  });

  const fetchCotizacionesPendientes = async () => {
    setLoadingCot(true);
    try {
      const res = await fetch(
        `${API}/cotizacion?per_page=20&sort=-fec_cot&filter[est_cot]=Pendiente`
      );
      const data = await res.json();
      setCotizacionesPendientes(data?.data || []);
    } catch {
      setCotizacionesPendientes([]);
    } finally {
      setLoadingCot(false);
    }
  };

  const fetchProducciones = async () => {
    setLoadingProd(true);
    try {
      const [resPendiente, resEnProceso, resCompletado] = await Promise.all([
        fetch(
          `${API}/produccion?per_page=15&sort=-fec_ini&filter[est_pro]=Pendiente`
        ),
        fetch(
          `${API}/produccion?per_page=15&sort=-fec_ini&filter[est_pro]=En Proceso`
        ),
        fetch(
          `${API}/produccion?per_page=10&sort=-fec_fin&filter[est_pro]=Completado`
        ),
      ]);
      const dataPendiente = await resPendiente.json();
      const dataEnProceso = await resEnProceso.json();
      const dataCompletado = await resCompletado.json();

      setProdPendientes(dataPendiente?.data || []);
      setProdEnProceso(dataEnProceso?.data || []);
      setProdCompletados(dataCompletado?.data || []);
    } catch {
      setProdPendientes([]);
      setProdEnProceso([]);
      setProdCompletados([]);
    } finally {
      setLoadingProd(false);
    }
  };

  useEffect(() => {
    fetchCotizacionesPendientes();
    fetchProducciones();
  }, [showProduccionModal, showGestionModal]);

  const handleStartProcess = (processId: string) => {
    switch (processId) {
      case "venta":
        setShowVentaModal(true);
        break;
      case "cotizacion":
        setShowCotizacionModal(true);
        break;
      case "cotizacion-nueva":
        setShowCotizacionNuevaModal(true);
        break;
      case "produccion":
        setShowProduccionModal(true);
        break;
      case "devolucion":
        setShowDevolucionModal(true);
        break;
      case "compra":
        setShowCompraModal(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-900 dark:bg-white rounded-xl">
            <Store className="w-7 h-7 text-white dark:text-gray-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Operaciones
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Gestiona ventas, cotizaciones, producción y más
            </p>
          </div>
        </div>
      </div>

      {/* Alert: Solicitudes de Cotización Pendientes */}
      {cotizacionesPendientes.length > 0 && (
        <div className="max-w-5xl mx-auto mb-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {cotizacionesPendientes.length}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                    Solicitudes de Cotización Pendientes
                  </h3>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Clientes esperando respuesta
                  </p>
                </div>
              </div>
              <button
                onClick={fetchCotizacionesPendientes}
                className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" /> Actualizar
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-[250px] overflow-y-auto">
              {loadingCot ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                </div>
              ) : (
                cotizacionesPendientes.map((cot) => (
                  <div
                    key={cot.id_cot}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-orange-100 dark:border-gray-700 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <User className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {cot.cod_cot}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cot.cliente?.nom_cli} {cot.cliente?.ap_pat_cli} •{" "}
                          {new Date(cot.fec_cot).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                        {cot.presupuesto_cliente
                          ? `~${Number(
                              cot.presupuesto_cliente
                            ).toLocaleString()} Bs.`
                          : Number(cot.total_cot) > 0
                          ? `${Number(cot.total_cot).toLocaleString()} Bs.`
                          : "Por cotizar"}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCotizacion(cot);
                          setShowGestionModal(true);
                        }}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition"
                      >
                        <Settings className="w-3 h-3" />
                        Gestionar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Process Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {processes.map((process) => (
          <ProcessCardItem
            key={process.id}
            process={process}
            onStart={() => handleStartProcess(process.id)}
          />
        ))}
      </div>

      {/* Sección de Producciones - 3 Acordeones */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Factory className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Control de Producciones
                </h2>
                <p className="text-xs text-gray-500">
                  {prodPendientes.length +
                    prodEnProceso.length +
                    prodCompletados.length}{" "}
                  producciones totales
                </p>
              </div>
            </div>
            <button
              onClick={fetchProducciones}
              className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Actualizar
            </button>
          </div>

          {loadingProd ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Acordeón Pendiente */}
              <div>
                <button
                  onClick={() =>
                    setAccordionOpen({
                      ...accordionOpen,
                      pendiente: !accordionOpen.pendiente,
                    })
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Pendiente
                    </span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {prodPendientes.length}
                    </span>
                  </div>
                  {accordionOpen.pendiente ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {accordionOpen.pendiente && (
                  <div className="px-4 pb-4 space-y-2">
                    {prodPendientes.length === 0 ? (
                      <p className="text-center text-gray-400 py-4">
                        Sin producciones pendientes
                      </p>
                    ) : (
                      prodPendientes.map((prod) => (
                        <div
                          key={prod.id_pro}
                          onClick={() => {
                            setSelectedProduccionId(prod.id_pro);
                            setShowDetalleModal(true);
                          }}
                          className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{prod.cod_pro}</p>
                              <p className="text-xs text-gray-500">
                                {prod.empleado?.nom_emp || "-"} • {prod.fec_ini}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              P{prod.prioridad}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInformeId(prod.id_pro);
                                setShowInformeModal(true);
                              }}
                              className="p-2 hover:bg-yellow-200 rounded-lg"
                              title="Ver informe"
                            >
                              <FileSpreadsheet className="w-4 h-4 text-yellow-700" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Acordeón En Proceso */}
              <div>
                <button
                  onClick={() =>
                    setAccordionOpen({
                      ...accordionOpen,
                      enProceso: !accordionOpen.enProceso,
                    })
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Factory className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      En Proceso
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {prodEnProceso.length}
                    </span>
                  </div>
                  {accordionOpen.enProceso ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {accordionOpen.enProceso && (
                  <div className="px-4 pb-4 space-y-2">
                    {prodEnProceso.length === 0 ? (
                      <p className="text-center text-gray-400 py-4">
                        Sin producciones en proceso
                      </p>
                    ) : (
                      prodEnProceso.map((prod) => (
                        <div
                          key={prod.id_pro}
                          onClick={() => {
                            setSelectedProduccionId(prod.id_pro);
                            setShowDetalleModal(true);
                          }}
                          className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{prod.cod_pro}</p>
                              <p className="text-xs text-gray-500">
                                {prod.empleado?.nom_emp || "-"} • {prod.fec_ini}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              P{prod.prioridad}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInformeId(prod.id_pro);
                                setShowInformeModal(true);
                              }}
                              className="p-2 hover:bg-blue-200 rounded-lg"
                              title="Ver informe"
                            >
                              <FileSpreadsheet className="w-4 h-4 text-blue-700" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Acordeón Completado */}
              <div>
                <button
                  onClick={() =>
                    setAccordionOpen({
                      ...accordionOpen,
                      completado: !accordionOpen.completado,
                    })
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Completado
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {prodCompletados.length}
                    </span>
                  </div>
                  {accordionOpen.completado ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {accordionOpen.completado && (
                  <div className="px-4 pb-4 space-y-2">
                    {prodCompletados.length === 0 ? (
                      <p className="text-center text-gray-400 py-4">
                        Sin producciones completadas
                      </p>
                    ) : (
                      prodCompletados.map((prod) => (
                        <div
                          key={prod.id_pro}
                          onClick={() => {
                            setSelectedProduccionId(prod.id_pro);
                            setShowDetalleModal(true);
                          }}
                          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{prod.cod_pro}</p>
                              <p className="text-xs text-gray-500">
                                {prod.empleado?.nom_emp || "-"} • Fin:{" "}
                                {prod.fec_fin_estimada}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInformeId(prod.id_pro);
                                setShowInformeModal(true);
                              }}
                              className="p-2 hover:bg-green-200 rounded-lg"
                              title="Ver informe"
                            >
                              <FileSpreadsheet className="w-4 h-4 text-green-700" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalVentaCompleta
        showModal={showVentaModal}
        setShowModal={setShowVentaModal}
      />
      <ModalCotizacionAVenta
        showModal={showCotizacionModal}
        setShowModal={setShowCotizacionModal}
      />
      <ModalDevolucion
        showModal={showDevolucionModal}
        setShowModal={setShowDevolucionModal}
      />
      <ModalCompraCompleta
        showModal={showCompraModal}
        setShowModal={setShowCompraModal}
      />
      <ModalCotizacionCompleta
        showModal={showCotizacionNuevaModal}
        setShowModal={setShowCotizacionNuevaModal}
      />
      <ModalProduccionCompleta
        showModal={showProduccionModal}
        setShowModal={setShowProduccionModal}
      />
      <ModalProduccionDetalle
        showModal={showDetalleModal}
        setShowModal={setShowDetalleModal}
        produccionId={selectedProduccionId}
        onUpdate={fetchProducciones}
      />
      <ModalProduccionInforme
        showModal={showInformeModal}
        setShowModal={setShowInformeModal}
        produccionId={selectedInformeId}
      />
      <ModalGestionCotizacion
        showModal={showGestionModal}
        setShowModal={setShowGestionModal}
        cotizacion={selectedCotizacion as any}
        onUpdate={fetchCotizacionesPendientes}
      />
    </div>
  );
}
