import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Cog,
  Factory,
  Layers,
  UserCheck,
  Settings,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  Calendar,
  FileText,
  CheckCircle,
  Save,
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
  empleado?: { nom_emp: string; ap_pat_emp: string; ap_mat_emp: string };
  produccion?: { fec_ini: string; fec_fin: string; cod_pro?: string };
  etapa?: { nom_eta: string };
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  ap_mat_emp?: string;
  cod_emp?: string;
}
interface Produccion {
  id_pro: number;
  fec_ini: string;
  fec_fin?: string;
  cod_pro?: string;
  est_pro?: string;
}
interface Etapa {
  id_eta: number;
  nom_eta: string;
  cod_eta?: string;
  duracion_estimada?: number;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  produccionetapaSeleccionado: ProduccionEtapa | null;
  setProduccionesEtapas: React.Dispatch<
    React.SetStateAction<ProduccionEtapa[]>
  >;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "produccion" | "etapa" | "empleado";

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-lg transition-all ${
        active
          ? "bg-white dark:bg-gray-900 text-cyan-600 border-t-2 border-x border-cyan-500 -mb-px"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
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

function ProduccionCard({
  produccion,
  isSelected,
  onSelect,
}: {
  produccion: Produccion;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-cyan-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Factory className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">
            {produccion.cod_pro}
          </p>
          <p className="text-sm font-medium">{produccion.fec_ini}</p>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              produccion.est_pro === "Completado"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {produccion.est_pro}
          </span>
        </div>
        {isSelected && <Check className="w-5 h-5 text-cyan-500" />}
      </div>
    </div>
  );
}

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
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-teal-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{etapa.cod_eta}</p>
          <p className="font-medium">{etapa.nom_eta}</p>
          {etapa.duracion_estimada && (
            <span className="text-xs text-gray-500">
              {etapa.duracion_estimada}h
            </span>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-teal-500" />}
      </div>
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
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{empleado.cod_emp}</p>
          <p className="font-medium">
            {empleado.nom_emp} {empleado.ap_pat_emp}
          </p>
        </div>
        {isSelected && <Check className="w-5 h-5 text-blue-500" />}
      </div>
    </div>
  );
}

export default function ModalEditarProduccionEtapa({
  showModal,
  setShowModal,
  produccionetapaSeleccionado,
  setProduccionesEtapas,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fec_ini: "",
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
  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [prodSearch, setProdSearch] = useState("");
  const [etapaSearch, setEtapaSearch] = useState("");
  const [empSearch, setEmpSearch] = useState("");
  const [prodPag, setProdPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [etapaPag, setEtapaPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [empPag, setEmpPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingProd, setLoadingProd] = useState(false);
  const [loadingEtapa, setLoadingEtapa] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const estados = ["Pendiente", "En Proceso", "Completado", "Cancelado"];

  const fetchProducciones = useCallback(async (page = 1, search = "") => {
    setLoadingProd(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/produccion?page=${page}&per_page=6${
          search ? `&filter[cod_pro]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setProducciones(p?.data || []);
      setProdPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setProducciones([]);
    } finally {
      setLoadingProd(false);
    }
  }, []);
  const fetchEtapas = useCallback(async (page = 1, search = "") => {
    setLoadingEtapa(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/etapa-produccion?page=${page}&per_page=6${
          search ? `&filter[nom_eta]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setEtapas(p?.data || []);
      setEtapaPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setEtapas([]);
    } finally {
      setLoadingEtapa(false);
    }
  }, []);
  const fetchEmpleados = useCallback(async (page = 1, search = "") => {
    setLoadingEmp(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/empleados?page=${page}&per_page=6${
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

  useEffect(() => {
    if (showModal) {
      fetchProducciones();
      fetchEtapas();
      fetchEmpleados();
    }
  }, [showModal, fetchProducciones, fetchEtapas, fetchEmpleados]);
  useEffect(() => {
    const t = setTimeout(() => fetchProducciones(1, prodSearch), 300);
    return () => clearTimeout(t);
  }, [prodSearch, fetchProducciones]);
  useEffect(() => {
    const t = setTimeout(() => fetchEtapas(1, etapaSearch), 300);
    return () => clearTimeout(t);
  }, [etapaSearch, fetchEtapas]);
  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empSearch), 300);
    return () => clearTimeout(t);
  }, [empSearch, fetchEmpleados]);

  useEffect(() => {
    if (produccionetapaSeleccionado) {
      setForm({
        fec_ini: produccionetapaSeleccionado.fec_ini || "",
        fec_fin: produccionetapaSeleccionado.fec_fin || "",
        est_eta: produccionetapaSeleccionado.est_eta || "Pendiente",
        notas: produccionetapaSeleccionado.notas || "",
      });
      setSelectedProduccion({
        id_pro: produccionetapaSeleccionado.id_pro,
        fec_ini: produccionetapaSeleccionado.produccion?.fec_ini || "",
        cod_pro: produccionetapaSeleccionado.produccion?.cod_pro,
      });
      setSelectedEtapa({
        id_eta: produccionetapaSeleccionado.id_eta,
        nom_eta: produccionetapaSeleccionado.etapa?.nom_eta || "",
      });
      setSelectedEmpleado({
        id_emp: produccionetapaSeleccionado.id_emp,
        nom_emp: produccionetapaSeleccionado.empleado?.nom_emp || "",
        ap_pat_emp: produccionetapaSeleccionado.empleado?.ap_pat_emp || "",
      });
    }
  }, [produccionetapaSeleccionado]);

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    if (
      !produccionetapaSeleccionado ||
      !selectedProduccion ||
      !selectedEtapa ||
      !selectedEmpleado
    )
      return;
    setIsSubmitting(true);
    setErrorMsg("");
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}
    try {
      const res = await fetch(
        `http://localhost:8000/api/produccion-etapa/${produccionetapaSeleccionado.id_pro_eta}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(uid ? { "X-USER-ID": uid } : {}),
          },
          body: JSON.stringify({
            fec_ini: form.fec_ini,
            fec_fin: form.fec_fin || null,
            est_eta: form.est_eta,
            notas: form.notas,
            id_pro: selectedProduccion.id_pro,
            id_eta: selectedEtapa.id_eta,
            id_emp: selectedEmpleado.id_emp,
          }),
        }
      );
      if (!res.ok) {
        const e = await res.json();
        setErrorMsg(
          e.errors ? Object.values(e.errors).flat().join(" ") : "Error"
        );
        return;
      }
      const data = (await res.json())?.data;
      setProduccionesEtapas((prev) =>
        prev.map((p) =>
          p.id_pro_eta === produccionetapaSeleccionado.id_pro_eta
            ? {
                ...data,
                produccion: {
                  fec_ini: selectedProduccion.fec_ini,
                  fec_fin: selectedProduccion.fec_fin,
                  cod_pro: selectedProduccion.cod_pro,
                },
                etapa: { nom_eta: selectedEtapa.nom_eta },
                empleado: {
                  nom_emp: selectedEmpleado.nom_emp,
                  ap_pat_emp: selectedEmpleado.ap_pat_emp,
                  ap_mat_emp: "",
                },
              }
            : p
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch {
      setErrorMsg("Error al actualizar");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !produccionetapaSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Cog className="w-6 h-6" />
            Editar Producción Etapa
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 bg-gray-50 dark:bg-gray-800/50 border-b overflow-x-auto">
          <TabButton
            active={activeTab === "datos"}
            onClick={() => setActiveTab("datos")}
            icon={Settings}
            label="Datos"
          />
          <TabButton
            active={activeTab === "produccion"}
            onClick={() => setActiveTab("produccion")}
            icon={Factory}
            label="Producción"
          />
          <TabButton
            active={activeTab === "etapa"}
            onClick={() => setActiveTab("etapa")}
            icon={Layers}
            label="Etapa"
          />
          <TabButton
            active={activeTab === "empleado"}
            onClick={() => setActiveTab("empleado")}
            icon={UserCheck}
            label="Empleado"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "datos" && (
            <div className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={form.fec_ini}
                    onChange={(e) =>
                      setForm({ ...form, fec_ini: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={form.fec_fin}
                    onChange={(e) =>
                      setForm({ ...form, fec_fin: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    Estado
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {estados.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setForm({ ...form, est_eta: e })}
                        className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          form.est_eta === e
                            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700"
                            : "border-gray-200 dark:border-gray-700 text-gray-500"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-cyan-500" />
                    Notas
                  </label>
                  <textarea
                    value={form.notas}
                    onChange={(e) =>
                      setForm({ ...form, notas: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Factory className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs font-medium">Producción</span>
                  </div>
                  <p className="font-bold text-sm">
                    {selectedProduccion?.cod_pro ||
                      `ID: ${selectedProduccion?.id_pro}`}
                  </p>
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-medium">Etapa</span>
                  </div>
                  <p className="font-bold text-sm">{selectedEtapa?.nom_eta}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium">Empleado</span>
                  </div>
                  <p className="font-bold text-sm">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "produccion" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Factory className="w-5 h-5 text-cyan-600" />
                Cambiar Producción
              </h3>
              <SearchInput
                value={prodSearch}
                onChange={setProdSearch}
                placeholder="Buscar producción..."
              />
              {loadingProd ? (
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
                    pagination={prodPag}
                    onPageChange={(p) => fetchProducciones(p, prodSearch)}
                    isLoading={loadingProd}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "etapa" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600" />
                Cambiar Etapa
              </h3>
              <SearchInput
                value={etapaSearch}
                onChange={setEtapaSearch}
                placeholder="Buscar etapa..."
              />
              {loadingEtapa ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {etapas.length > 0 ? (
                      etapas.map((e) => (
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
                  <MiniPagination
                    pagination={etapaPag}
                    onPageChange={(p) => fetchEtapas(p, etapaSearch)}
                    isLoading={loadingEtapa}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "empleado" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Cambiar Empleado
              </h3>
              <SearchInput
                value={empSearch}
                onChange={setEmpSearch}
                placeholder="Buscar empleado..."
              />
              {loadingEmp ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
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
        </div>

        <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !selectedProduccion ||
              !selectedEtapa ||
              !selectedEmpleado
            }
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
