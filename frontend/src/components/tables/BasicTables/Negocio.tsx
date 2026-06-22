import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Plus
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
import Badge from "../../ui/badge/Badge";

interface IProcessCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

interface Cotizacion {
  id: number;
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
  id: number;
  cod_pro: string;
  fec_ini: string;
  fec_fin_estimada: string;
  est_pro: string;
  prioridad: string;
  cotizacion?: { cod_cot: string; cliente?: { nom_cli: string } };
  venta?: { cod_ven: string; cliente?: { nom_cli: string } };
  empleado?: { nom_emp: string; ap_pat_emp?: string };
}

const API = "http://localhost:8080/api";

const processes: IProcessCard[] = [
  {
    id: "venta",
    title: "Nueva Venta",
    description: "Venta directa de productos disponibles en inventario.",
    icon: <ShoppingCart size={22} />,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    id: "cotizacion-nueva",
    title: "Nueva Cotización",
    description: "Crea una propuesta formal para clientes potenciales.",
    icon: <FileText size={22} />,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    id: "cotizacion",
    title: "Cotización a Venta",
    description: "Convierte una cotización aprobada en una orden real.",
    icon: <CheckCircle size={22} />,
    colorClass: "text-indigo-500",
    bgClass: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    id: "produccion",
    title: "Iniciar Producción",
    description: "Envía una orden a fábrica y asigna etapas de manufactura.",
    icon: <Factory size={22} />,
    colorClass: "text-cyan-500",
    bgClass: "bg-cyan-50 dark:bg-cyan-500/10",
  },
  {
    id: "compra",
    title: "Comprar Materiales",
    description: "Abastecimiento de insumos con proveedores registrados.",
    icon: <Package size={22} />,
    colorClass: "text-purple-500",
    bgClass: "bg-purple-50 dark:bg-purple-500/10",
  },
  {
    id: "devolucion",
    title: "Procesar Devolución",
    description: "Registra devoluciones y reingresos al inventario.",
    icon: <RotateCcw size={22} />,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-50 dark:bg-orange-500/10",
  },
];

export default function Negocio() {
  const [showVentaModal, setShowVentaModal] = useState(false);
  const [showCotizacionModal, setShowCotizacionModal] = useState(false);
  const [showCotizacionNuevaModal, setShowCotizacionNuevaModal] = useState(false);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);
  const [showCompraModal, setShowCompraModal] = useState(false);
  const [showProduccionModal, setShowProduccionModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showInformeModal, setShowInformeModal] = useState(false);
  const [showGestionModal, setShowGestionModal] = useState(false);
  
  const [selectedProduccionId, setSelectedProduccionId] = useState<number | null>(null);
  const [selectedInformeId, setSelectedInformeId] = useState<number | null>(null);
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);

  // States
  const [cotizacionesPendientes, setCotizacionesPendientes] = useState<Cotizacion[]>([]);
  const [loadingCot, setLoadingCot] = useState(false);

  const [prodPendientes, setProdPendientes] = useState<Produccion[]>([]);
  const [prodEnProceso, setProdEnProceso] = useState<Produccion[]>([]);
  const [prodCompletados, setProdCompletados] = useState<Produccion[]>([]);
  const [loadingProd, setLoadingProd] = useState(false);

  const [accordionOpen, setAccordionOpen] = useState({
    pendiente: true,
    enProceso: true,
    completado: false,
  });

  const fetchCotizacionesPendientes = async () => {
    setLoadingCot(true);
    try {
      const res = await fetch(`${API}/cotizaciones?per_page=20&sort=-fec_cot&filter[est_cot]=Pendiente`);
      const data = await res.json();
      const content = data?.data?.content || data?.data || [];
      setCotizacionesPendientes(Array.isArray(content) ? content : []);
    } catch (error) {
      console.error("Error fetching cotizaciones:", error);
      setCotizacionesPendientes([]);
    } finally {
      setLoadingCot(false);
    }
  };

  const fetchProducciones = async () => {
    setLoadingProd(true);
    try {
      const [resPendiente, resEnProceso, resCompletado] = await Promise.all([
        fetch(`${API}/producciones?per_page=15&sort=-fec_ini&filter[est_pro]=Pendiente`),
        fetch(`${API}/producciones?per_page=15&sort=-fec_ini&filter[est_pro]=En Proceso`),
        fetch(`${API}/producciones?per_page=10&sort=-fec_fin&filter[est_pro]=Completado`),
      ]);
      const dataPendiente = await resPendiente.json();
      const dataEnProceso = await resEnProceso.json();
      const dataCompletado = await resCompletado.json();

      setProdPendientes(Array.isArray(dataPendiente?.data?.content) ? dataPendiente.data.content : []);
      setProdEnProceso(Array.isArray(dataEnProceso?.data?.content) ? dataEnProceso.data.content : []);
      setProdCompletados(Array.isArray(dataCompletado?.data?.content) ? dataCompletado.data.content : []);
    } catch (error) {
      console.error("Error fetching producciones:", error);
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
      case "venta": setShowVentaModal(true); break;
      case "cotizacion": setShowCotizacionModal(true); break;
      case "cotizacion-nueva": setShowCotizacionNuevaModal(true); break;
      case "produccion": setShowProduccionModal(true); break;
      case "devolucion": setShowDevolucionModal(true); break;
      case "compra": setShowCompraModal(true); break;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-white/2 p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20">
            <Store size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Centro de Operaciones</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gestiona ventas, solicitudes, y producción desde un solo lugar.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => { fetchCotizacionesPendientes(); fetchProducciones(); }}
             className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold transition-colors"
           >
             <RotateCcw size={16} className={(loadingCot || loadingProd) ? "animate-spin" : ""} />
             Sincronizar
           </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Actions (Process Cards) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 self-start sticky top-6">
          <div className="flex items-center gap-2 mb-2 px-2">
             <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
             <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Acciones Rápidas</h2>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {processes.map((process) => (
              <motion.div
                key={process.id}
                variants={itemVariants}
                onClick={() => handleStartProcess(process.id)}
                className="group cursor-pointer bg-white dark:bg-white/2 rounded-2xl border border-gray-200 dark:border-white/5 p-5 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Decorative blob */}
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/5 to-amber-500/5 blur-2xl group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-colors" />
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${process.bgClass} ${process.colorClass}`}>
                  {process.icon}
                </div>
                
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {process.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {process.description}
                </p>
                
                <div className="flex items-center text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 mt-auto">
                  Ejecutar ahora
                  <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Notifications & Status */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          {/* Alertas de Cotizaciones */}
          <div className="bg-white dark:bg-white/2 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-orange-50/50 dark:bg-orange-500/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500">
                  <Bell size={20} className={cotizacionesPendientes.length > 0 ? "animate-pulse" : ""} />
                  {cotizacionesPendientes.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-900">
                      {cotizacionesPendientes.length}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Solicitudes Recientes</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cotizaciones pendientes de revisión</p>
                </div>
              </div>
            </div>
            
            <div className="p-2 overflow-y-auto max-h-[240px] custom-scrollbar">
              {loadingCot ? (
                <div className="flex justify-center items-center h-32">
                   <Loader2 className="animate-spin text-orange-500" />
                </div>
              ) : cotizacionesPendientes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <CheckCircle size={32} strokeWidth={1} className="mb-2 opacity-30 text-green-500" />
                  <p className="text-xs font-medium">Todo al día</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {cotizacionesPendientes.map((cot) => (
                    <div key={cot.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-orange-100 dark:hover:border-white/10" onClick={() => { setSelectedCotizacion(cot); setShowGestionModal(true); }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 shrink-0">
                           <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-orange-500 transition-colors">
                            {cot.cliente?.nom_cli} {cot.cliente?.ap_pat_cli || ""}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase font-mono mt-0.5">{cot.cod_cot}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <Badge size="sm" color="warning">Pendiente</Badge>
                         <span className="text-[10px] text-gray-400 mt-1">{new Date(cot.fec_cot).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Control de Producciones */}
          <div className="bg-white dark:bg-white/2 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Factory size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Estado de Fábrica</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Control de órdenes de producción</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 overflow-y-auto max-h-[450px] custom-scrollbar">
              {loadingProd ? (
                <div className="flex justify-center items-center h-32">
                   <Loader2 className="animate-spin text-cyan-500" />
                </div>
              ) : (
                <div className="space-y-2">
                  
                  {/* Pendiente */}
                  <div className="rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <button onClick={() => setAccordionOpen(p => ({...p, pendiente: !p.pendiente}))} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-2">
                         <Clock size={16} className="text-yellow-500" />
                         <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Pendientes</span>
                         <Badge size="sm" color="warning">{prodPendientes.length}</Badge>
                       </div>
                       {accordionOpen.pendiente ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                    </button>
                    <AnimatePresence>
                      {accordionOpen.pendiente && (
                        <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden">
                           <div className="p-2 space-y-1 bg-white dark:bg-transparent">
                             {prodPendientes.length === 0 ? <p className="text-xs text-gray-400 text-center py-3">Ninguna orden</p> : 
                              prodPendientes.map(prod => (
                                <div key={prod.id} onClick={() => { setSelectedProduccionId(prod.id); setShowDetalleModal(true); }} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-500/10 cursor-pointer transition-colors group">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{prod.cod_pro}</span>
                                    <span className="text-[10px] text-gray-500">Resp: {prod.empleado?.nom_emp || "Sin asignar"}</span>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedInformeId(prod.id); setShowInformeModal(true); }} className="p-1.5 text-gray-400 hover:text-yellow-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                                     <FileSpreadsheet size={14} />
                                  </button>
                                </div>
                              ))
                             }
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* En Proceso */}
                  <div className="rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <button onClick={() => setAccordionOpen(p => ({...p, enProceso: !p.enProceso}))} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-2">
                         <Loader2 size={16} className="text-blue-500 animate-spin" />
                         <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">En Proceso</span>
                         <Badge size="sm" color="info">{prodEnProceso.length}</Badge>
                       </div>
                       {accordionOpen.enProceso ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                    </button>
                    <AnimatePresence>
                      {accordionOpen.enProceso && (
                        <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden">
                           <div className="p-2 space-y-1 bg-white dark:bg-transparent">
                             {prodEnProceso.length === 0 ? <p className="text-xs text-gray-400 text-center py-3">Ninguna orden</p> : 
                              prodEnProceso.map(prod => (
                                <div key={prod.id} onClick={() => { setSelectedProduccionId(prod.id); setShowDetalleModal(true); }} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 cursor-pointer transition-colors group">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{prod.cod_pro}</span>
                                    <span className="text-[10px] text-gray-500">P{prod.prioridad} • Inicio: {prod.fec_ini}</span>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedInformeId(prod.id); setShowInformeModal(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                                     <FileSpreadsheet size={14} />
                                  </button>
                                </div>
                              ))
                             }
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Completado */}
                  <div className="rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <button onClick={() => setAccordionOpen(p => ({...p, completado: !p.completado}))} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-2">
                         <CheckCircle size={16} className="text-green-500" />
                         <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Completado</span>
                         <Badge size="sm" color="success">{prodCompletados.length}</Badge>
                       </div>
                       {accordionOpen.completado ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                    </button>
                    <AnimatePresence>
                      {accordionOpen.completado && (
                        <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden">
                           <div className="p-2 space-y-1 bg-white dark:bg-transparent">
                             {prodCompletados.length === 0 ? <p className="text-xs text-gray-400 text-center py-3">Ninguna orden</p> : 
                              prodCompletados.map(prod => (
                                <div key={prod.id} onClick={() => { setSelectedProduccionId(prod.id); setShowDetalleModal(true); }} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-500/10 cursor-pointer transition-colors group">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{prod.cod_pro}</span>
                                    <span className="text-[10px] text-gray-500">Fin: {prod.fec_fin_estimada}</span>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedInformeId(prod.id); setShowInformeModal(true); }} className="p-1.5 text-gray-400 hover:text-green-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                                     <FileSpreadsheet size={14} />
                                  </button>
                                </div>
                              ))
                             }
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modals invisibles */}
      <ModalVentaCompleta showModal={showVentaModal} setShowModal={setShowVentaModal} />
      <ModalCotizacionAVenta showModal={showCotizacionModal} setShowModal={setShowCotizacionModal} />
      <ModalDevolucion showModal={showDevolucionModal} setShowModal={setShowDevolucionModal} />
      <ModalCompraCompleta showModal={showCompraModal} setShowModal={setShowCompraModal} />
      <ModalCotizacionCompleta showModal={showCotizacionNuevaModal} setShowModal={setShowCotizacionNuevaModal} />
      <ModalProduccionCompleta showModal={showProduccionModal} setShowModal={setShowProduccionModal} />
      <ModalProduccionDetalle showModal={showDetalleModal} setShowModal={setShowDetalleModal} produccionId={selectedProduccionId} onUpdate={fetchProducciones} />
      <ModalProduccionInforme showModal={showInformeModal} setShowModal={setShowInformeModal} produccionId={selectedInformeId} />
      <ModalGestionCotizacion showModal={showGestionModal} setShowModal={setShowGestionModal} cotizacion={selectedCotizacion as any} onUpdate={fetchCotizacionesPendientes} />
    </div>
  );
}
