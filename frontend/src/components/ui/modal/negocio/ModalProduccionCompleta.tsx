import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Factory,
  User,
  Calendar,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  ImageIcon,
  Package,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  FileText,
  ShoppingCart,
  Layers,
} from "lucide-react";

interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  img_emp?: string;
}

interface Venta {
  id_ven: number;
  cod_ven: string;
  fec_ven: string;
  total_ven: number;
  est_ven?: string;
  metodo_pago?: string;
  cliente?: {
    nom_cli: string;
    ap_pat_cli?: string;
    ci_cli?: string;
    tel_cli?: string;
  };
  empleado?: { nom_emp: string; ap_pat_emp?: string };
  detalles?: DetalleVenta[];
}

interface DetalleVenta {
  id_det_ven: number;
  id_mue: number;
  cantidad: number;
  precio_unitario?: number;
  descuento_item?: number;
  mueble?: { nom_mue: string; img_mue?: string; cod_mue?: string };
}

interface Cotizacion {
  id_cot: number;
  cod_cot: string;
  fec_cot: string;
  fec_vencimiento?: string;
  total_cot: number;
  est_cot?: string;
  descripcion?: string;
  cliente?: {
    nom_cli: string;
    ap_pat_cli?: string;
    ci_cli?: string;
    tel_cli?: string;
  };
  empleado?: { nom_emp: string; ap_pat_emp?: string };
  detalles?: DetalleCotizacion[];
  costos?: CostoCotizacion[];
}

interface DetalleCotizacion {
  id_det_cot: number;
  cod_det_cot?: string;
  id_mue: number;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
  nombre_mueble?: string;
  tipo_mueble?: string;
  dimensiones?: string;
  material_principal?: string;
  color_acabado?: string;
  herrajes?: string;
  desc_personalizacion?: string;
  mueble?: { nom_mue: string; img_mue?: string; cod_mue?: string };
}

interface CostoCotizacion {
  id_cos_cot: number;
  descripcion: string;
  monto: number;
}

interface DetalleItem {
  id_mue: number;
  nom_mue: string;
  img_mue?: string;
  cantidad: number;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

interface EtapaProduccion {
  id_eta: number;
  cod_eta?: string;
  nom_eta: string;
  desc_eta?: string;
  duracion_estimada?: number;
  orden_secuencia?: number;
}

const API = "http://localhost:8000/api";

// Formatear fecha en español (DD/MM/YYYY)
const formatDateES = (dateStr?: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getImageUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/storage/${path}`;
};

function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(src);
  if (!imageUrl || error) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
      >
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { label: string; icon: React.ReactNode }[];
}) {
  return (
    <div className="flex items-center justify-center w-full px-2 py-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {index + 1 < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`mt-1 text-xs font-medium hidden sm:block ${
                index + 1 === currentStep ? "text-cyan-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-1 mx-1 rounded ${
                index + 1 < currentStep
                  ? "bg-green-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 text-sm"
      />
    </div>
  );
}

function MiniPagination({
  pagination,
  onPageChange,
  isLoading,
}: {
  pagination: PaginationInfo;
  onPageChange: (p: number) => void;
  isLoading: boolean;
}) {
  if (pagination.lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t">
      <button
        onClick={() => onPageChange(1)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs px-2">
        {pagination.currentPage}/{pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function EmpleadoCard({
  empleado,
  isSelected,
  onSelect,
}: {
  empleado: Empleado;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        isSelected
          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <ProductImage
          src={empleado.img_emp}
          alt={empleado.nom_emp}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {empleado.nom_emp} {empleado.ap_pat_emp}
          </h4>
        </div>
        {isSelected && <Check className="w-6 h-6 text-cyan-500" />}
      </div>
    </div>
  );
}

export default function ModalProduccionCompleta({
  showModal,
  setShowModal,
}: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [origen, setOrigen] = useState<"venta" | "cotizacion">("cotizacion");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);
  const [origenSearch, setOrigenSearch] = useState("");
  const [origenPag, setOrigenPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingOrigen, setLoadingOrigen] = useState(false);
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [empSearch, setEmpSearch] = useState("");
  const [empPag, setEmpPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingEmp, setLoadingEmp] = useState(false);

  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [cotizacionDetalles, setCotizacionDetalles] = useState<
    DetalleCotizacion[]
  >([]);
  const [ventaDetalles, setVentaDetalles] = useState<DetalleVenta[]>([]);
  const [fechaIni, setFechaIni] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");
  const [prioridad, setPrioridad] = useState("5");
  const [notas, setNotas] = useState("");

  // Estado para etapas de producción
  const [etapasDisponibles, setEtapasDisponibles] = useState<EtapaProduccion[]>(
    []
  );
  const [etapasSeleccionadas, setEtapasSeleccionadas] = useState<number[]>([]);
  const [loadingEtapas, setLoadingEtapas] = useState(false);

  const steps = [
    { label: "Origen", icon: <FileText className="w-4 h-4" /> },
    { label: "Empleado", icon: <User className="w-4 h-4" /> },
    { label: "Fechas", icon: <Calendar className="w-4 h-4" /> },
    { label: "Etapas", icon: <Layers className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchVentas = useCallback(async (page = 1, search = "") => {
    setLoadingOrigen(true);
    try {
      const res = await fetch(
        `${API}/venta?page=${page}&per_page=6${
          search ? `&filter[cod_ven]=${encodeURIComponent(search)}` : ""
        }&filter[sin_produccion]=true`
      );
      const p = await res.json();
      setVentas(p?.data || []);
      setOrigenPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setVentas([]);
    } finally {
      setLoadingOrigen(false);
    }
  }, []);

  const fetchCotizaciones = useCallback(async (page = 1, search = "") => {
    setLoadingOrigen(true);
    try {
      const res = await fetch(
        `${API}/cotizacion?page=${page}&per_page=6${
          search ? `&filter[cod_cot]=${encodeURIComponent(search)}` : ""
        }&filter[est_cot]=Aprobado&filter[sin_produccion]=true`
      );
      const p = await res.json();
      setCotizaciones(p?.data || []);
      setOrigenPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setCotizaciones([]);
    } finally {
      setLoadingOrigen(false);
    }
  }, []);

  const fetchEmpleados = useCallback(async (page = 1, search = "") => {
    setLoadingEmp(true);
    try {
      const res = await fetch(
        `${API}/empleados?page=${page}&per_page=6${
          search ? `&filter[nom_emp]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setEmpleados(p?.data || []);
      setEmpPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setEmpleados([]);
    } finally {
      setLoadingEmp(false);
    }
  }, []);

  const fetchEtapas = useCallback(async () => {
    setLoadingEtapas(true);
    try {
      const res = await fetch(
        `${API}/etapa-produccion?per_page=50&sort=orden_secuencia`
      );
      const p = await res.json();
      setEtapasDisponibles(p?.data || []);
      // Seleccionar todas las etapas por defecto
      const ids = (p?.data || []).map((e: EtapaProduccion) => e.id_eta);
      setEtapasSeleccionadas(ids);
    } catch {
      setEtapasDisponibles([]);
    } finally {
      setLoadingEtapas(false);
    }
  }, []);

  const fetchDetallesVenta = useCallback(async (id_ven: number) => {
    setLoadingDetalles(true);
    try {
      const res = await fetch(`${API}/venta/${id_ven}`);
      const data = await res.json();
      // Guardar detalles originales de venta
      setVentaDetalles(data?.detalles || []);
      if (data?.detalles && data.detalles.length > 0) {
        setDetalles(
          data.detalles.map((d: DetalleVenta) => ({
            id_mue: d.id_mue,
            nom_mue: d.mueble?.nom_mue || `Mueble ${d.id_mue}`,
            img_mue: d.mueble?.img_mue,
            cantidad: d.cantidad,
          }))
        );
      } else {
        setDetalles([
          {
            id_mue: 0,
            nom_mue: "Producción general",
            cantidad: 1,
            img_mue: undefined,
          },
        ]);
      }
    } catch {
      setDetalles([
        {
          id_mue: 0,
          nom_mue: "Producción general",
          cantidad: 1,
          img_mue: undefined,
        },
      ]);
    } finally {
      setLoadingDetalles(false);
    }
  }, []);

  const fetchDetallesCotizacion = useCallback(async (id_cot: number) => {
    setLoadingDetalles(true);
    try {
      const res = await fetch(`${API}/cotizacion/${id_cot}`);
      const data = await res.json();
      // Guardar detalles originales de cotización
      setCotizacionDetalles(data?.detalles || []);
      if (data?.detalles && data.detalles.length > 0) {
        setDetalles(
          data.detalles.map((d: DetalleCotizacion) => ({
            id_mue: d.id_mue,
            nom_mue:
              d.nombre_mueble || d.mueble?.nom_mue || `Mueble ${d.id_mue}`,
            img_mue: d.mueble?.img_mue,
            cantidad: d.cantidad,
          }))
        );
      } else {
        setDetalles([
          {
            id_mue: 0,
            nom_mue: "Producción personalizada",
            cantidad: 1,
            img_mue: undefined,
          },
        ]);
      }
    } catch {
      setDetalles([
        {
          id_mue: 0,
          nom_mue: "Producción personalizada",
          cantidad: 1,
          img_mue: undefined,
        },
      ]);
    } finally {
      setLoadingDetalles(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchVentas();
      fetchCotizaciones();
      fetchEmpleados();
      fetchEtapas();
    }
  }, [showModal, fetchVentas, fetchCotizaciones, fetchEmpleados, fetchEtapas]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (origen === "venta") fetchVentas(1, origenSearch);
      else fetchCotizaciones(1, origenSearch);
    }, 300);
    return () => clearTimeout(t);
  }, [origenSearch, origen, fetchVentas, fetchCotizaciones]);

  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empSearch), 300);
    return () => clearTimeout(t);
  }, [empSearch, fetchEmpleados]);

  useEffect(() => {
    setSelectedVenta(null);
    setSelectedCotizacion(null);
    setOrigenSearch("");
    setDetalles([]);
    if (origen === "venta") fetchVentas();
    else fetchCotizaciones();
  }, [origen, fetchVentas, fetchCotizaciones]);

  useEffect(() => {
    if (selectedVenta) {
      fetchDetallesVenta(selectedVenta.id_ven);
    }
  }, [selectedVenta, fetchDetallesVenta]);

  useEffect(() => {
    if (selectedCotizacion) {
      fetchDetallesCotizacion(selectedCotizacion.id_cot);
    }
  }, [selectedCotizacion, fetchDetallesCotizacion]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setOrigen("cotizacion");
    setSelectedVenta(null);
    setSelectedCotizacion(null);
    setSelectedEmpleado(null);
    setDetalles([]);
    setCotizacionDetalles([]);
    setVentaDetalles([]);
    setFechaIni(new Date().toISOString().split("T")[0]);
    setFechaFinEstimada("");
    setPrioridad("5");
    setNotas("");
    setEtapasSeleccionadas([]);
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return (
          (origen === "venta" && !!selectedVenta) ||
          (origen === "cotizacion" && !!selectedCotizacion)
        );
      case 2:
        return !!selectedEmpleado;
      case 3:
        return !!fechaIni && !!fechaFinEstimada && fechaFinEstimada >= fechaIni;
      case 4:
        return etapasSeleccionadas.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmpleado || !fechaIni || !fechaFinEstimada) return;
    if (origen === "venta" && !selectedVenta) return;
    if (origen === "cotizacion" && !selectedCotizacion) return;

    if (detalles.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Sin muebles",
        text: "No hay muebles para producir.",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        produccion: {
          fec_ini: fechaIni,
          fec_fin_estimada: fechaFinEstimada,
          prioridad: prioridad,
          id_ven: origen === "venta" ? selectedVenta?.id_ven : null,
          id_cot: origen === "cotizacion" ? selectedCotizacion?.id_cot : null,
          id_emp: selectedEmpleado.id_emp,
          notas: notas || null,
        },
        detalles: detalles.map((d) => ({
          id_mue: d.id_mue && d.id_mue > 0 ? d.id_mue : null,
          cantidad: d.cantidad,
          nombre_mueble: d.nom_mue,
        })),
        etapas: etapasSeleccionadas,
      };

      const res = await fetch(`${API}/negocio/produccion-completa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear producción");

      Swal.fire({
        icon: "success",
        title: "¡Producción creada!",
        html: `<p>Código: <b>${
          data.data?.produccion?.cod_pro
        }</b></p><p>Muebles: ${
          data.data?.detalles?.length || 0
        }</p><p>Etapas asignadas: ${data.data?.etapas || 0}</p>`,
        showConfirmButton: true,
      });
      handleClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo crear la producción";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-linear-to-r from-cyan-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Factory className="w-6 h-6" />
            Iniciar Producción
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600" />
                Seleccionar Cotización o Venta
              </h3>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setOrigen("cotizacion")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 transition-all ${
                    origen === "cotizacion"
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700"
                      : "border-gray-200 dark:border-gray-700 text-gray-500"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Cotización Aprobada
                </button>
                <button
                  onClick={() => setOrigen("venta")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 transition-all ${
                    origen === "venta"
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700"
                      : "border-gray-200 dark:border-gray-700 text-gray-500"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Venta
                </button>
              </div>

              <SearchInput
                value={origenSearch}
                onChange={setOrigenSearch}
                placeholder={
                  origen === "venta"
                    ? "Buscar venta por código..."
                    : "Buscar cotización por código..."
                }
              />

              {loadingOrigen ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                    {origen === "venta" ? (
                      ventas.length > 0 ? (
                        ventas.map((v) => (
                          <div
                            key={v.id_ven}
                            onClick={() => setSelectedVenta(v)}
                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                              selectedVenta?.id_ven === v.id_ven
                                ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md"
                                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  selectedVenta?.id_ven === v.id_ven
                                    ? "bg-cyan-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              >
                                <ShoppingCart className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 font-mono">
                                  {v.cod_ven}
                                </p>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {v.cliente?.nom_cli || "Sin cliente"}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Bs. {Number(v.total_ven || 0).toFixed(2)}
                                </p>
                              </div>
                              {selectedVenta?.id_ven === v.id_ven && (
                                <Check className="w-6 h-6 text-cyan-500" />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                          <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                          <p>No se encontraron ventas</p>
                        </div>
                      )
                    ) : cotizaciones.length > 0 ? (
                      cotizaciones.map((c) => (
                        <div
                          key={c.id_cot}
                          onClick={() => setSelectedCotizacion(c)}
                          className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                            selectedCotizacion?.id_cot === c.id_cot
                              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                selectedCotizacion?.id_cot === c.id_cot
                                  ? "bg-cyan-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            >
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-mono">
                                {c.cod_cot}
                              </p>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {c.cliente?.nom_cli || "Sin cliente"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Bs. {Number(c.total_cot || 0).toFixed(2)}
                              </p>
                            </div>
                            {selectedCotizacion?.id_cot === c.id_cot && (
                              <Check className="w-6 h-6 text-cyan-500" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No hay cotizaciones aprobadas</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={origenPag}
                    onPageChange={(p) =>
                      origen === "venta"
                        ? fetchVentas(p, origenSearch)
                        : fetchCotizaciones(p, origenSearch)
                    }
                    isLoading={loadingOrigen}
                  />
                </>
              )}

              {loadingDetalles ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl flex justify-center">
                  <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                detalles.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-green-700">
                      <Package className="w-4 h-4" />
                      Muebles a Producir ({detalles.length})
                    </h4>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {detalles.map((d, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <ProductImage
                            src={d.img_mue}
                            alt={d.nom_mue}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{d.nom_mue}</p>
                          </div>
                          <span className="font-bold text-green-600">
                            x{d.cantidad}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-600" />
                Seleccionar Empleado Responsable
              </h3>
              <SearchInput
                value={empSearch}
                onChange={setEmpSearch}
                placeholder="Buscar empleado..."
              />
              {loadingEmp ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {empleados.length > 0 ? (
                      empleados.map((e) => (
                        <EmpleadoCard
                          key={e.id_emp}
                          empleado={e}
                          isSelected={selectedEmpleado?.id_emp === e.id_emp}
                          onSelect={() => setSelectedEmpleado(e)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron empleados</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={empPag}
                    onPageChange={(p) => fetchEmpleados(p, empSearch)}
                    isLoading={loadingEmp}
                  />
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                Configurar Fechas y Prioridad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={fechaIni}
                    onChange={(e) => setFechaIni(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha Fin Estimada *
                  </label>
                  <input
                    type="date"
                    value={fechaFinEstimada}
                    min={fechaIni}
                    onChange={(e) => setFechaFinEstimada(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prioridad
                </label>
                <div className="flex gap-2">
                  {["1", "3", "5", "7", "10"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrioridad(p)}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                        prioridad === p
                          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-cyan-300"
                      }`}
                    >
                      {p === "1"
                        ? "Urgente"
                        : p === "3"
                        ? "Alta"
                        : p === "5"
                        ? "Normal"
                        : p === "7"
                        ? "Baja"
                        : "Mínima"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-600" />
                Seleccionar Etapas de Producción
              </h3>
              <p className="text-sm text-gray-500">
                Seleccione las etapas que se asignarán a esta producción. Por
                defecto todas están seleccionadas.
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() =>
                    setEtapasSeleccionadas(
                      etapasDisponibles.map((e) => e.id_eta)
                    )
                  }
                  className="px-3 py-1.5 text-sm bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200"
                >
                  Seleccionar todas
                </button>
                <button
                  onClick={() => setEtapasSeleccionadas([])}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Quitar todas
                </button>
              </div>

              {loadingEtapas ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : etapasDisponibles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay etapas disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
                  {etapasDisponibles.map((etapa) => {
                    const isSelected = etapasSeleccionadas.includes(
                      etapa.id_eta
                    );
                    return (
                      <div
                        key={etapa.id_eta}
                        onClick={() => {
                          if (isSelected) {
                            setEtapasSeleccionadas(
                              etapasSeleccionadas.filter(
                                (id) => id !== etapa.id_eta
                              )
                            );
                          } else {
                            setEtapasSeleccionadas([
                              ...etapasSeleccionadas,
                              etapa.id_eta,
                            ]);
                          }
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-cyan-500 border-cyan-500"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {etapa.nom_eta}
                          </p>
                          {etapa.desc_eta && (
                            <p className="text-xs text-gray-500 truncate">
                              {etapa.desc_eta}
                            </p>
                          )}
                          {etapa.duracion_estimada && (
                            <p className="text-xs text-cyan-600">
                              {etapa.duracion_estimada} días
                            </p>
                          )}
                        </div>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          #{etapa.orden_secuencia || "-"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200">
                <p className="text-sm text-cyan-700">
                  <Check className="w-4 h-4 inline mr-1" />
                  {etapasSeleccionadas.length} etapa(s) seleccionada(s)
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-cyan-600" />
                Confirmar Orden de Producción
              </h3>

              {/* Información del Origen (Cotización/Venta) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                  {origen === "venta" ? (
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-lg">
                      {origen === "venta" ? "Venta" : "Cotización"}:{" "}
                      {origen === "venta"
                        ? selectedVenta?.cod_ven
                        : selectedCotizacion?.cod_cot}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {origen === "venta"
                        ? `Fecha: ${formatDateES(selectedVenta?.fec_ven)}`
                        : `Fecha: ${formatDateES(selectedCotizacion?.fec_cot)}`}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xl font-bold text-cyan-600">
                      Bs.{" "}
                      {Number(
                        origen === "venta"
                          ? selectedVenta?.total_ven
                          : selectedCotizacion?.total_cot || 0
                      ).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        origen === "venta"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {origen === "venta"
                        ? selectedVenta?.est_ven || "Completada"
                        : selectedCotizacion?.est_cot || "Aprobado"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cliente */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Cliente
                    </p>
                    <p className="font-semibold">
                      {origen === "venta"
                        ? `${selectedVenta?.cliente?.nom_cli || ""} ${
                            selectedVenta?.cliente?.ap_pat_cli || ""
                          }`
                        : `${selectedCotizacion?.cliente?.nom_cli || ""} ${
                            selectedCotizacion?.cliente?.ap_pat_cli || ""
                          }`}
                    </p>
                    {(origen === "venta"
                      ? selectedVenta?.cliente?.ci_cli
                      : selectedCotizacion?.cliente?.ci_cli) && (
                      <p className="text-sm text-gray-500">
                        CI:{" "}
                        {origen === "venta"
                          ? selectedVenta?.cliente?.ci_cli
                          : selectedCotizacion?.cliente?.ci_cli}
                      </p>
                    )}
                  </div>

                  {/* Vendedor/Empleado */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Vendedor
                    </p>
                    <p className="font-semibold">
                      {origen === "venta"
                        ? `${selectedVenta?.empleado?.nom_emp || ""} ${
                            selectedVenta?.empleado?.ap_pat_emp || ""
                          }`
                        : `${selectedCotizacion?.empleado?.nom_emp || ""} ${
                            selectedCotizacion?.empleado?.ap_pat_emp || ""
                          }`}
                    </p>
                  </div>
                </div>

                {origen === "cotizacion" && selectedCotizacion?.descripcion && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-600 uppercase mb-1">
                      Descripción
                    </p>
                    <p className="text-sm">{selectedCotizacion.descripcion}</p>
                  </div>
                )}

                {/* Detalles de la Cotización */}
                {origen === "cotizacion" && cotizacionDetalles.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Detalle de Cotización ({cotizacionDetalles.length} items)
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <th className="text-left p-2 rounded-l-lg">
                              Código
                            </th>
                            <th className="text-left p-2">Mueble</th>
                            <th className="text-left p-2">Tipo</th>
                            <th className="text-left p-2">Dimensiones</th>
                            <th className="text-left p-2">Material</th>
                            <th className="text-left p-2">Color</th>
                            <th className="text-left p-2">Herrajes</th>
                            <th className="text-center p-2">Cant.</th>
                            <th className="text-right p-2">P. Unit.</th>
                            <th className="text-right p-2 rounded-r-lg">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cotizacionDetalles.map((d, idx) => (
                            <tr
                              key={idx}
                              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <td className="p-2 font-mono text-gray-500">
                                {d.cod_det_cot || "-"}
                              </td>
                              <td className="p-2">
                                <p className="font-medium">
                                  {d.nombre_mueble ||
                                    d.mueble?.nom_mue ||
                                    `Mueble ${d.id_mue}`}
                                </p>
                                {d.desc_personalizacion && (
                                  <p className="text-gray-500 italic">
                                    {d.desc_personalizacion}
                                  </p>
                                )}
                              </td>
                              <td className="p-2">{d.tipo_mueble || "-"}</td>
                              <td className="p-2">{d.dimensiones || "-"}</td>
                              <td className="p-2">
                                {d.material_principal || "-"}
                              </td>
                              <td className="p-2">{d.color_acabado || "-"}</td>
                              <td className="p-2">{d.herrajes || "-"}</td>
                              <td className="p-2 text-center font-bold">
                                {d.cantidad}
                              </td>
                              <td className="p-2 text-right">
                                Bs. {Number(d.precio_unitario || 0).toFixed(2)}
                              </td>
                              <td className="p-2 text-right font-semibold text-cyan-600">
                                Bs.{" "}
                                {Number(
                                  d.subtotal ||
                                    (d.precio_unitario || 0) * d.cantidad
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <td
                              colSpan={7}
                              className="p-2 text-right font-semibold"
                            >
                              Total:
                            </td>
                            <td className="p-2 text-center font-bold">
                              {cotizacionDetalles.reduce(
                                (sum, d) => sum + d.cantidad,
                                0
                              )}
                            </td>
                            <td className="p-2"></td>
                            <td className="p-2 text-right font-bold text-cyan-600">
                              Bs.{" "}
                              {cotizacionDetalles
                                .reduce(
                                  (sum, d) =>
                                    sum +
                                    Number(
                                      d.subtotal ||
                                        (d.precio_unitario || 0) * d.cantidad
                                    ),
                                  0
                                )
                                .toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Detalles de la Venta */}
                {origen === "venta" && ventaDetalles.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Detalle de Venta
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <th className="text-left p-2 rounded-l-lg">
                              Mueble
                            </th>
                            <th className="text-center p-2">Cant.</th>
                            <th className="text-right p-2">P. Unit.</th>
                            <th className="text-right p-2">Desc.</th>
                            <th className="text-right p-2 rounded-r-lg">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventaDetalles.map((d, idx) => {
                            const subtotal =
                              Number(d.precio_unitario || 0) * d.cantidad -
                              Number(d.descuento_item || 0);
                            return (
                              <tr
                                key={idx}
                                className="border-b dark:border-gray-700"
                              >
                                <td className="p-2">
                                  <p className="font-medium">
                                    {d.mueble?.nom_mue || `Mueble ${d.id_mue}`}
                                  </p>
                                  {d.mueble?.cod_mue && (
                                    <p className="text-xs text-gray-500">
                                      {d.mueble.cod_mue}
                                    </p>
                                  )}
                                </td>
                                <td className="p-2 text-center font-medium">
                                  {d.cantidad}
                                </td>
                                <td className="p-2 text-right">
                                  Bs.{" "}
                                  {Number(d.precio_unitario || 0).toFixed(2)}
                                </td>
                                <td className="p-2 text-right text-red-500">
                                  {Number(d.descuento_item || 0) > 0
                                    ? `-Bs. ${Number(d.descuento_item).toFixed(
                                        2
                                      )}`
                                    : "-"}
                                </td>
                                <td className="p-2 text-right font-semibold">
                                  Bs. {subtotal.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Datos de Producción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold">
                      Responsable de Producción
                    </span>
                  </div>
                  <p className="font-bold text-cyan-600">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                </div>
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold">Fechas de Producción</span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Inicio:</span> {fechaIni}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Fin estimado:</span>{" "}
                    {fechaFinEstimada}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Prioridad:</span>{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        prioridad === "1"
                          ? "bg-red-100 text-red-700"
                          : prioridad === "3"
                          ? "bg-orange-100 text-orange-700"
                          : prioridad === "5"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {prioridad === "1"
                        ? "Urgente"
                        : prioridad === "3"
                        ? "Alta"
                        : prioridad === "5"
                        ? "Normal"
                        : prioridad === "7"
                        ? "Baja"
                        : "Mínima"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Muebles a Producir */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Muebles a Producir ({detalles.length})
                </h4>
                <div className="space-y-2">
                  {detalles.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-white dark:bg-gray-900 rounded-lg border"
                    >
                      <ProductImage
                        src={d.img_mue}
                        alt={d.nom_mue}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{d.nom_mue}</p>
                      </div>
                      <span className="font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                        x{d.cantidad}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between text-lg font-bold">
                  <span>Total Unidades</span>
                  <span className="text-cyan-600">
                    {detalles.reduce((sum, d) => sum + d.cantidad, 0)}
                  </span>
                </div>
              </div>

              {/* Costos adicionales (solo cotización) */}
              {origen === "cotizacion" &&
                selectedCotizacion?.costos &&
                selectedCotizacion.costos.length > 0 && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200">
                    <h4 className="font-medium mb-2 text-purple-700">
                      Costos Adicionales
                    </h4>
                    <div className="space-y-1">
                      {selectedCotizacion.costos.map((c, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{c.descripcion}</span>
                          <span className="font-medium">
                            Bs. {Number(c.monto).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {notas && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200">
                  <p className="text-sm font-medium">Notas de Producción:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {notas}
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">
                    Etapas de Producción ({etapasSeleccionadas.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {etapasDisponibles
                    .filter((e) => etapasSeleccionadas.includes(e.id_eta))
                    .sort(
                      (a, b) =>
                        (a.orden_secuencia || 0) - (b.orden_secuencia || 0)
                    )
                    .map((etapa) => (
                      <span
                        key={etapa.id_eta}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        <Check className="w-3 h-3" />
                        {etapa.nom_eta}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {loading ? "Procesando..." : "Crear Producción"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
