import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Layers,
  Factory,
  ListOrdered,
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
  FileText,
} from "lucide-react";

interface ProduccionEtapa {
  id_pro_eta: number;
  fec_ini: string;
  fec_fin: string;
  est_eta: string;
  notas: string;
  id_emp: number;
  id_pro: number;
  id_eta: number;
}

interface Produccion {
  id_pro: number;
  cod_pro?: string;
  fec_ini: string;
  fec_fin: string;
  fec_fin_estimada?: string;
  est_pro: string;
  prioridad?: string;
}

interface Etapa {
  id_eta: number;
  nom_eta: string;
  desc_eta?: string;
  duracion_estimada?: number;
  orden_secuencia?: number;
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
  setProduccionesEtapas: React.Dispatch<
    React.SetStateAction<ProduccionEtapa[]>
  >;
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
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
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
                  ? "text-cyan-600 dark:text-cyan-400"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
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

// Card de Produccion
function ProduccionCard({
  produccion,
  isSelected,
  onSelect,
}: {
  produccion: Produccion;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const getPrioridadColor = (p?: string) => {
    switch (p) {
      case "Alta":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Media":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Baja":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-cyan-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-cyan-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <Factory className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {produccion.cod_pro}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {produccion.fec_ini}
          </h4>
          <div className="flex gap-2 items-center">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                produccion.est_pro === "Completado"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {produccion.est_pro}
            </span>
            {produccion.prioridad && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${getPrioridadColor(
                  produccion.prioridad
                )}`}
              >
                {produccion.prioridad}
              </span>
            )}
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-cyan-500 shrink-0" />}
      </div>
    </div>
  );
}

// Card de Etapa
function EtapaCard({
  etapa,
  isSelected,
  onSelect,
}: {
  etapa: Etapa;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-purple-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <ListOrdered className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              {etapa.nom_eta}
            </h4>
            {etapa.orden_secuencia && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                #{etapa.orden_secuencia}
              </span>
            )}
          </div>
          {etapa.desc_eta && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {etapa.desc_eta}
            </p>
          )}
          {etapa.duracion_estimada && (
            <p className="text-xs text-cyan-600 dark:text-cyan-400">
              {etapa.duracion_estimada} hrs estimadas
            </p>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-purple-500 shrink-0" />}
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

export default function ModalAgregarProduccionEtapa({
  showModal,
  setShowModal,
  setProduccionesEtapas,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fec_ini: new Date().toISOString().split("T")[0],
    fec_fin: "",
    est_eta: "Pendiente",
    notas: "",
  });

  const [selectedProduccion, setSelectedProduccion] =
    useState<Produccion | null>(null);
  const [selectedEtapa, setSelectedEtapa] = useState<Etapa | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );

  // Producciones
  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [produccionesPagination, setProduccionesPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [produccionesLoading, setProduccionesLoading] = useState(false);
  const [searchProduccion, setSearchProduccion] = useState("");

  // Etapas
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [etapasLoading, setEtapasLoading] = useState(false);
  const [searchEtapa, setSearchEtapa] = useState("");

  // Empleados
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadosPagination, setEmpleadosPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [empleadosLoading, setEmpleadosLoading] = useState(false);
  const [searchEmpleado, setSearchEmpleado] = useState("");

  const steps = [
    { label: "Producción", icon: <Factory className="w-4 h-4" /> },
    { label: "Etapa", icon: <ListOrdered className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Detalles", icon: <Settings className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchProducciones = useCallback(
    async (page: number, search: string = "") => {
      setProduccionesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
        });
        if (search) params.append("filter[cod_pro]", search);
        const res = await fetch(
          `http://localhost:8000/api/produccion?${params}`
        );
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setProducciones(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setProduccionesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch {
        setProducciones([]);
      } finally {
        setProduccionesLoading(false);
      }
    },
    []
  );

  const fetchEtapas = useCallback(async (search: string = "") => {
    setEtapasLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("filter[nom_eta]", search);
      const res = await fetch(
        `http://localhost:8000/api/etapa-produccion?${params}`
      );
      const payload = await res.json();
      const items = payload?.data ?? payload;
      setEtapas(Array.isArray(items) ? items : []);
    } catch {
      setEtapas([]);
    } finally {
      setEtapasLoading(false);
    }
  }, []);

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
          `http://localhost:8000/api/empleados?${params}`
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
      fetchProducciones(1, "");
      fetchEtapas("");
      fetchEmpleados(1, "");
    }
  }, [showModal, fetchProducciones, fetchEtapas, fetchEmpleados]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchProducciones(1, searchProduccion), 300);
    return () => clearTimeout(timer);
  }, [searchProduccion, showModal, fetchProducciones]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchEtapas(searchEtapa), 300);
    return () => clearTimeout(timer);
  }, [searchEtapa, showModal, fetchEtapas]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchEmpleados(1, searchEmpleado), 300);
    return () => clearTimeout(timer);
  }, [searchEmpleado, showModal, fetchEmpleados]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedProduccion(null);
    setSelectedEtapa(null);
    setSelectedEmpleado(null);
    setForm({
      fec_ini: new Date().toISOString().split("T")[0],
      fec_fin: "",
      est_eta: "Pendiente",
      notas: "",
    });
  };

  const handleSubmit = async () => {
    if (!selectedProduccion || !selectedEtapa || !selectedEmpleado) return;
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
      const produccionEtapaData = {
        ...form,
        fec_fin: form.fec_fin || null,
        id_pro: selectedProduccion.id_pro,
        id_eta: selectedEtapa.id_eta,
        id_emp: selectedEmpleado.id_emp,
      };
      const res = await fetch("http://localhost:8000/api/produccion-etapa", {
        method: "POST",
        headers,
        body: JSON.stringify(produccionEtapaData),
      });
      if (!res.ok) throw new Error("Error al crear la etapa de producción");

      const updatedRes = await fetch(
        "http://localhost:8000/api/produccion-etapa"
      );
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setProduccionesEtapas(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Etapa asignada!",
        text: "La etapa se ha asignado a la producción exitosamente.",
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
        text: "No se pudo asignar la etapa.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedProduccion;
      case 2:
        return !!selectedEtapa;
      case 3:
        return !!selectedEmpleado;
      case 4:
        return !!form.fec_ini;
      default:
        return true;
    }
  };

  // Filter etapas locally
  const etapasFiltradas = searchEtapa
    ? etapas.filter((e) =>
        e.nom_eta.toLowerCase().includes(searchEtapa.toLowerCase())
      )
    : etapas;

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Layers className="w-6 h-6" />
            Asignar Etapa a Producción
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
                <Factory className="w-5 h-5 text-cyan-600" />
                Seleccionar Producción
              </h3>
              <SearchInput
                value={searchProduccion}
                onChange={setSearchProduccion}
                placeholder="Buscar por código..."
              />
              {produccionesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {producciones.length > 0 ? (
                      producciones.map((p) => (
                        <ProduccionCard
                          key={p.id_pro}
                          produccion={p}
                          isSelected={selectedProduccion?.id_pro === p.id_pro}
                          onSelect={() => setSelectedProduccion(p)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron producciones</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={produccionesPagination}
                    onPageChange={(p) => fetchProducciones(p, searchProduccion)}
                    isLoading={produccionesLoading}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-purple-600" />
                Seleccionar Etapa
              </h3>
              <SearchInput
                value={searchEtapa}
                onChange={setSearchEtapa}
                placeholder="Buscar etapa..."
              />
              {etapasLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
                  {etapasFiltradas.length > 0 ? (
                    etapasFiltradas.map((e) => (
                      <EtapaCard
                        key={e.id_eta}
                        etapa={e}
                        isSelected={selectedEtapa?.id_eta === e.id_eta}
                        onSelect={() => setSelectedEtapa(e)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                      <p>No se encontraron etapas</p>
                    </div>
                  )}
                </div>
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
                <Settings className="w-5 h-5 text-cyan-600" />
                Detalles de la Etapa
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
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha Fin (opcional)
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <select
                      value={form.est_eta}
                      onChange={(e) =>
                        setForm({ ...form, est_eta: e.target.value })
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
                      <FileText className="w-4 h-4 inline mr-1" />
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
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-200 dark:border-cyan-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Factory className="w-4 h-4 text-cyan-600" />
                    Producción
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-mono">
                    {selectedProduccion?.cod_pro}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedProduccion?.fec_ini}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      selectedProduccion?.est_pro === "Completado"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedProduccion?.est_pro}
                  </span>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-purple-600" />
                    Etapa
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {selectedEtapa?.nom_eta}
                  </p>
                  {selectedEtapa?.duracion_estimada && (
                    <p className="text-sm text-purple-600">
                      {selectedEtapa.duracion_estimada} hrs
                    </p>
                  )}
                  {selectedEtapa?.orden_secuencia && (
                    <p className="text-xs text-gray-500">
                      Orden: #{selectedEtapa.orden_secuencia}
                    </p>
                  )}
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
                  <Settings className="w-4 h-4 text-cyan-600" />
                  Detalles
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
                      Fecha Fin
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {form.fec_fin || "No definida"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Estado
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {form.est_eta}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Notas
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {form.notas || "-"}
                    </p>
                  </div>
                </div>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-cyan-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Asignar Etapa
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
