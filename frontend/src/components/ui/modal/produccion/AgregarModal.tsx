import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Factory,
  ShoppingBag,
  FileText,
  UserCheck,
  Settings,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  Calendar,
  Flag,
  Clock,
} from "lucide-react";

interface Produccion {
  id_pro: number;
  cod_pro?: string;
  fec_ini: string;
  fec_fin: string;
  fec_fin_estimada: string;
  est_pro: string;
  prioridad: string;
  notas: string;
  id_ven: number;
  id_emp: number;
  id_cot: number;
}

interface Venta {
  id_ven: number;
  cod_ven?: string;
  fec_ven: string;
  est_ven: string;
  total_ven: number;
}

interface Cotizacion {
  id_cot: number;
  cod_cot?: string;
  fec_cot: string;
  est_cot: string;
  total_cot: number;
}

interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  ap_mat_emp: string;
  cod_emp?: string;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setProducciones: React.Dispatch<React.SetStateAction<Produccion[]>>;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

// Step Indicator
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
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
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
                index + 1 === currentStep
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-1 mx-1 rounded transition-all duration-300 ${
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

// SearchInput
function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
      />
    </div>
  );
}

// MiniPagination
function MiniPagination({
  pagination,
  onPageChange,
  isLoading,
}: {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) {
  if (pagination.lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        {pagination.currentPage} / {pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Card de Venta
function VentaCard({
  venta,
  isSelected,
  onSelect,
}: {
  venta: Venta;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {venta.cod_ven}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {venta.fec_ven}
          </h4>
          <div className="flex gap-2">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                venta.est_ven === "Completada"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {venta.est_ven}
            </span>
            <span className="text-xs text-blue-600 font-medium">
              {venta.total_ven} Bs.
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-blue-500 shrink-0" />}
      </div>
    </div>
  );
}

// Card de Cotizacion
function CotizacionCard({
  cotizacion,
  isSelected,
  onSelect,
}: {
  cotizacion: Cotizacion;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {cotizacion.cod_cot}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {cotizacion.fec_cot}
          </h4>
          <div className="flex gap-2">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                cotizacion.est_cot === "Aprobado"
                  ? "bg-green-100 text-green-700"
                  : cotizacion.est_cot === "Pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {cotizacion.est_cot}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              {cotizacion.total_cot} Bs.
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-emerald-500 shrink-0" />}
      </div>
    </div>
  );
}

// Card de Empleado
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
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {empleado.cod_emp}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {empleado.nom_emp} {empleado.ap_pat_emp}
          </h4>
        </div>
        {isSelected && <Check className="w-5 h-5 text-indigo-500 shrink-0" />}
      </div>
    </div>
  );
}

export default function ModalAgregarProduccion({
  showModal,
  setShowModal,
  setProducciones,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fec_ini: new Date().toISOString().split("T")[0],
    fec_fin: "",
    fec_fin_estimada: "",
    est_pro: "Pendiente",
    prioridad: "Media",
    notas: "",
  });

  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );

  // Ventas
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasPagination, setVentasPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [ventasLoading, setVentasLoading] = useState(false);
  const [searchVenta, setSearchVenta] = useState("");

  // Cotizaciones
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cotizacionesPagination, setCotizacionesPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [cotizacionesLoading, setCotizacionesLoading] = useState(false);
  const [searchCotizacion, setSearchCotizacion] = useState("");

  // Empleados
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadosPagination, setEmpleadosPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [empleadosLoading, setEmpleadosLoading] = useState(false);
  const [searchEmpleado, setSearchEmpleado] = useState("");

  const steps = [
    { label: "Venta", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Cotización", icon: <FileText className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Detalles", icon: <Settings className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchVentas = useCallback(async (page: number, search: string = "") => {
    setVentasLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "8",
      });
      if (search) params.append("filter[cod_ven]", search);
      const res = await fetch(`http://localhost:8080/api/venta?${params}`);
      const payload = await res.json();
      const items = payload?.data ?? payload;
      setVentas(Array.isArray(items) ? items : []);
      if (payload?.meta || payload?.last_page) {
        setVentasPagination({
          currentPage:
            payload?.meta?.current_page ?? payload?.current_page ?? page,
          lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
          total: payload?.meta?.total ?? payload?.total ?? items.length,
        });
      }
    } catch {
      setVentas([]);
    } finally {
      setVentasLoading(false);
    }
  }, []);

  const fetchCotizaciones = useCallback(
    async (page: number, search: string = "") => {
      setCotizacionesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
        });
        if (search) params.append("filter[cod_cot]", search);
        const res = await fetch(
          `http://localhost:8080/api/cotizacion?${params}`
        );
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setCotizaciones(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setCotizacionesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch {
        setCotizaciones([]);
      } finally {
        setCotizacionesLoading(false);
      }
    },
    []
  );

  const fetchEmpleados = useCallback(
    async (page: number, search: string = "") => {
      setEmpleadosLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
        });
        if (search) params.append("filter[nom_emp]", search);
        const res = await fetch(
          `http://localhost:8080/api/empleados?${params}`
        );
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setEmpleados(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setEmpleadosPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch {
        setEmpleados([]);
      } finally {
        setEmpleadosLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (showModal) {
      fetchVentas(1, "");
      fetchCotizaciones(1, "");
      fetchEmpleados(1, "");
    }
  }, [showModal, fetchVentas, fetchCotizaciones, fetchEmpleados]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchVentas(1, searchVenta), 300);
    return () => clearTimeout(timer);
  }, [searchVenta, showModal, fetchVentas]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchCotizaciones(1, searchCotizacion), 300);
    return () => clearTimeout(timer);
  }, [searchCotizacion, showModal, fetchCotizaciones]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchEmpleados(1, searchEmpleado), 300);
    return () => clearTimeout(timer);
  }, [searchEmpleado, showModal, fetchEmpleados]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedVenta(null);
    setSelectedCotizacion(null);
    setSelectedEmpleado(null);
    setForm({
      fec_ini: new Date().toISOString().split("T")[0],
      fec_fin: "",
      fec_fin_estimada: "",
      est_pro: "Pendiente",
      prioridad: "Media",
      notas: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !selectedVenta ||
      !selectedCotizacion ||
      !selectedEmpleado ||
      !form.fec_fin_estimada
    )
      return;
    let idUsuarioLocal = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload: any = jwtDecode(token);
        idUsuarioLocal = payload.id_usu || null;
      }
    } catch {
      idUsuarioLocal = null;
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
    };
    setIsSubmitting(true);
    try {
      const produccionData = {
        ...form,
        fec_fin: form.fec_fin || null,
        id_ven: selectedVenta.id_ven,
        id_cot: selectedCotizacion.id_cot,
        id_emp: selectedEmpleado.id_emp,
      };
      const res = await fetch("http://localhost:8080/api/produccion", {
        method: "POST",
        headers,
        body: JSON.stringify(produccionData),
      });
      if (!res.ok) throw new Error("Error al crear la producción");

      const updatedRes = await fetch("http://localhost:8080/api/produccion");
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setProducciones(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Producción creada!",
        text: "La producción se ha registrado exitosamente.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose();
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la producción.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedVenta;
      case 2:
        return !!selectedCotizacion;
      case 3:
        return !!selectedEmpleado;
      case 4:
        return !!form.fec_ini && !!form.fec_fin_estimada && !!form.prioridad;
      default:
        return true;
    }
  };

  const getPrioridadColor = (p: string) => {
    switch (p) {
      case "Alta":
        return "bg-red-500";
      case "Media":
        return "bg-yellow-500";
      case "Baja":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Factory className="w-6 h-6" />
            Nueva Producción
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Seleccionar Venta
              </h3>
              <SearchInput
                value={searchVenta}
                onChange={setSearchVenta}
                placeholder="Buscar por código..."
              />
              {ventasLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {ventas.length > 0 ? (
                      ventas.map((v) => (
                        <VentaCard
                          key={v.id_ven}
                          venta={v}
                          isSelected={selectedVenta?.id_ven === v.id_ven}
                          onSelect={() => setSelectedVenta(v)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron ventas</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={ventasPagination}
                    onPageChange={(p) => fetchVentas(p, searchVenta)}
                    isLoading={ventasLoading}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Seleccionar Cotización
              </h3>
              <SearchInput
                value={searchCotizacion}
                onChange={setSearchCotizacion}
                placeholder="Buscar por código..."
              />
              {cotizacionesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {cotizaciones.length > 0 ? (
                      cotizaciones.map((c) => (
                        <CotizacionCard
                          key={c.id_cot}
                          cotizacion={c}
                          isSelected={selectedCotizacion?.id_cot === c.id_cot}
                          onSelect={() => setSelectedCotizacion(c)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron cotizaciones</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={cotizacionesPagination}
                    onPageChange={(p) => fetchCotizaciones(p, searchCotizacion)}
                    isLoading={cotizacionesLoading}
                  />
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Seleccionar Empleado Responsable
              </h3>
              <SearchInput
                value={searchEmpleado}
                onChange={setSearchEmpleado}
                placeholder="Buscar empleado..."
              />
              {empleadosLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
                    pagination={empleadosPagination}
                    onPageChange={(p) => fetchEmpleados(p, searchEmpleado)}
                    isLoading={empleadosLoading}
                  />
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Configuración de Producción
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha Inicio *
                    </label>
                    <input
                      type="date"
                      value={form.fec_ini}
                      onChange={(e) =>
                        setForm({ ...form, fec_ini: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Fecha Fin Estimada *
                    </label>
                    <input
                      type="date"
                      value={form.fec_fin_estimada}
                      onChange={(e) =>
                        setForm({ ...form, fec_fin_estimada: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha Fin Real (opcional)
                    </label>
                    <input
                      type="date"
                      value={form.fec_fin}
                      onChange={(e) =>
                        setForm({ ...form, fec_fin: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Flag className="w-4 h-4 inline mr-1" />
                      Prioridad *
                    </label>
                    <div className="flex gap-2">
                      {["Alta", "Media", "Baja"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setForm({ ...form, prioridad: p })}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                            form.prioridad === p
                              ? `${getPrioridadColor(p)} text-white shadow-lg`
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <select
                      value={form.est_pro}
                      onChange={(e) =>
                        setForm({ ...form, est_pro: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notas
                    </label>
                    <textarea
                      value={form.notas}
                      onChange={(e) =>
                        setForm({ ...form, notas: e.target.value })
                      }
                      rows={3}
                      placeholder="Notas adicionales..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    Venta
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-mono">
                    {selectedVenta?.cod_ven}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedVenta?.fec_ven}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {selectedVenta?.total_ven} Bs.
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Cotización
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-mono">
                    {selectedCotizacion?.cod_cot}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedCotizacion?.fec_cot}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">
                    {selectedCotizacion?.total_cot} Bs.
                  </p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    Responsable
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                  <p className="text-sm text-gray-500 font-mono">
                    {selectedEmpleado?.cod_emp}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-600" />
                  Detalles de Producción
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fecha Inicio
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {form.fec_ini}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Fecha Estimada
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {form.fec_fin_estimada}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Estado
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {form.est_pro}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Prioridad
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-white text-sm ${getPrioridadColor(
                        form.prioridad
                      )}`}
                    >
                      {form.prioridad}
                    </span>
                  </div>
                </div>
                {form.notas && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Notas
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {form.notas}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={step === 1 ? handleClose : () => setStep(step - 1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {step === 1 ? "Cancelar" : "Anterior"}
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-purple-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Crear Producción
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
