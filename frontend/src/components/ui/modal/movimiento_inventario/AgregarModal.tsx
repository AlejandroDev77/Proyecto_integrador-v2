import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Package,
  Boxes,
  Armchair,
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
  Hash,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileText,
  Calendar,
} from "lucide-react";

interface MovimientoInventario {
  id_mov: number;
  cod_mov?: string;
  tipo_mov: string;
  fecha_mov: string;
  cantidad: number;
  stock_anterior: number;
  stock_posterior: number;
  motivo: string;
  id_mat: number;
  id_mue: number;
  id_emp: number;
  material?: { nom_mat: string };
  mueble?: { nom_mue: string };
  empleado?: { nom_emp: string; ap_pat_emp: string };
}
interface Material {
  id_mat: number;
  nom_mat: string;
  cod_mat?: string;
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  cod_emp?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setMovimientosInventarios: React.Dispatch<
    React.SetStateAction<MovimientoInventario[]>
  >;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
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
                  ? "bg-violet-600 text-white shadow-lg"
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
                index + 1 === currentStep ? "text-violet-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-6 sm:w-10 h-1 mx-0.5 rounded ${
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 text-sm"
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

function TipoMovCard({
  tipo,
  isSelected,
  onSelect,
}: {
  tipo: { value: string; label: string; icon: any; color: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = tipo.icon;
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        isSelected
          ? `border-${tipo.color}-500 bg-${tipo.color}-50 dark:bg-${tipo.color}-900/20 shadow-md`
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSelected
              ? `bg-${tipo.color}-500 text-white`
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-medium text-sm">{tipo.label}</span>
        {isSelected && <Check className={`w-5 h-5 text-${tipo.color}-500`} />}
      </div>
    </div>
  );
}

function MaterialCard({
  material,
  isSelected,
  onSelect,
}: {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-violet-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Boxes className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{material.cod_mat}</p>
          <h4 className="font-medium text-sm truncate">{material.nom_mat}</h4>
        </div>
        {isSelected && <Check className="w-5 h-5 text-violet-500" />}
      </div>
    </div>
  );
}

function MuebleCard({
  mueble,
  isSelected,
  onSelect,
}: {
  mueble: Mueble;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Armchair className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{mueble.cod_mue}</p>
          <h4 className="font-medium text-sm truncate">{mueble.nom_mue}</h4>
        </div>
        {isSelected && <Check className="w-5 h-5 text-indigo-500" />}
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
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-purple-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{empleado.cod_emp}</p>
          <h4 className="font-medium text-sm truncate">
            {empleado.nom_emp} {empleado.ap_pat_emp}
          </h4>
        </div>
        {isSelected && <Check className="w-5 h-5 text-purple-500" />}
      </div>
    </div>
  );
}

export default function ModalAgregarMovimientoInventario({
  showModal,
  setShowModal,
  setMovimientosInventarios,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    tipo_mov: "",
    fecha_mov: new Date().toISOString().split("T")[0],
    cantidad: 1,
    stock_anterior: 0,
    stock_posterior: 0,
    motivo: "",
  });
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [selectedMueble, setSelectedMueble] = useState<Mueble | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [matSearch, setMatSearch] = useState("");
  const [mueSearch, setMueSearch] = useState("");
  const [empSearch, setEmpSearch] = useState("");
  const [matPag, setMatPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [muePag, setMuePag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [empPag, setEmpPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingMat, setLoadingMat] = useState(false);
  const [loadingMue, setLoadingMue] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(false);

  const tiposMovimiento = [
    { value: "Entrada", label: "Entrada", icon: ArrowUp, color: "green" },
    { value: "Salida", label: "Salida", icon: ArrowDown, color: "red" },
    { value: "Ajuste", label: "Ajuste", icon: RefreshCw, color: "amber" },
  ];
  const steps = [
    { label: "Tipo", icon: <Package className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Producto", icon: <Boxes className="w-4 h-4" /> },
    { label: "Detalles", icon: <Settings className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchMateriales = useCallback(async (page = 1, search = "") => {
    setLoadingMat(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/materiales?page=${page}&per_page=6${
          search ? `&filter[nom_mat]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setMateriales(p?.data || []);
      setMatPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setMateriales([]);
    } finally {
      setLoadingMat(false);
    }
  }, []);
  const fetchMuebles = useCallback(async (page = 1, search = "") => {
    setLoadingMue(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/mueble?page=${page}&per_page=6${
          search ? `&filter[nom_mue]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setMuebles(p?.data || []);
      setMuePag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setMuebles([]);
    } finally {
      setLoadingMue(false);
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
      fetchMateriales();
      fetchMuebles();
      fetchEmpleados();
    }
  }, [showModal, fetchMateriales, fetchMuebles, fetchEmpleados]);
  useEffect(() => {
    const t = setTimeout(() => fetchMateriales(1, matSearch), 300);
    return () => clearTimeout(t);
  }, [matSearch, fetchMateriales]);
  useEffect(() => {
    const t = setTimeout(() => fetchMuebles(1, mueSearch), 300);
    return () => clearTimeout(t);
  }, [mueSearch, fetchMuebles]);
  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empSearch), 300);
    return () => clearTimeout(t);
  }, [empSearch, fetchEmpleados]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedMaterial(null);
    setSelectedMueble(null);
    setSelectedEmpleado(null);
    setForm({
      tipo_mov: "",
      fecha_mov: new Date().toISOString().split("T")[0],
      cantidad: 1,
      stock_anterior: 0,
      stock_posterior: 0,
      motivo: "",
    });
  };
  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!form.tipo_mov;
      case 2:
        return !!selectedEmpleado;
      case 3:
        return !!selectedMaterial || !!selectedMueble;
      case 4:
        return form.cantidad > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (
      !form.tipo_mov ||
      !selectedEmpleado ||
      (!selectedMaterial && !selectedMueble)
    )
      return;
    setIsSubmitting(true);
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}
    try {
      const res = await fetch(
        "http://localhost:8000/api/movimiento-inventario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(uid ? { "X-USER-ID": uid } : {}),
          },
          body: JSON.stringify({
            ...form,
            id_mat: selectedMaterial?.id_mat || null,
            id_mue: selectedMueble?.id_mue || null,
            id_emp: selectedEmpleado.id_emp,
          }),
        }
      );
      if (!res.ok) throw new Error("Error");
      const data = (await res.json())?.data || (await res.json());
      setMovimientosInventarios((prev) => [
        ...prev,
        {
          ...data,
          material: selectedMaterial
            ? { nom_mat: selectedMaterial.nom_mat }
            : undefined,
          mueble: selectedMueble
            ? { nom_mue: selectedMueble.nom_mue }
            : undefined,
          empleado: {
            nom_emp: selectedEmpleado.nom_emp,
            ap_pat_emp: selectedEmpleado.ap_pat_emp,
          },
        },
      ]);
      Swal.fire({
        icon: "success",
        title: "¡Movimiento registrado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch {
      Swal.fire({ icon: "error", title: "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6" />
            Nuevo Movimiento de Inventario
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
                <Package className="w-5 h-5 text-violet-600" />
                Tipo de Movimiento
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {tiposMovimiento.map((t) => (
                  <div
                    key={t.value}
                    onClick={() => setForm({ ...form, tipo_mov: t.value })}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md flex flex-col items-center gap-2 ${
                      form.tipo_mov === t.value
                        ? `border-${t.color}-500 bg-${t.color}-50 dark:bg-${t.color}-900/20`
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        form.tipo_mov === t.value
                          ? `bg-${t.color}-500 text-white`
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <t.icon className="w-6 h-6" />
                    </div>
                    <span className="font-medium">{t.label}</span>
                    {form.tipo_mov === t.value && (
                      <Check className={`w-5 h-5 text-${t.color}-500`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                Seleccionar Empleado Responsable
              </h3>
              <SearchInput
                value={empSearch}
                onChange={setEmpSearch}
                placeholder="Buscar empleado..."
              />
              {loadingEmp ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
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
                <Boxes className="w-5 h-5 text-violet-600" />
                Seleccionar Producto (Material o Mueble)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Boxes className="w-4 h-4" />
                    Materiales
                  </h4>
                  <SearchInput
                    value={matSearch}
                    onChange={setMatSearch}
                    placeholder="Buscar material..."
                  />
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {loadingMat ? (
                      <div className="text-center py-4">
                        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : (
                      materiales.map((m) => (
                        <MaterialCard
                          key={m.id_mat}
                          material={m}
                          isSelected={selectedMaterial?.id_mat === m.id_mat}
                          onSelect={() => {
                            setSelectedMaterial(m);
                            setSelectedMueble(null);
                          }}
                        />
                      ))
                    )}
                  </div>
                  <MiniPagination
                    pagination={matPag}
                    onPageChange={(p) => fetchMateriales(p, matSearch)}
                    isLoading={loadingMat}
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Armchair className="w-4 h-4" />
                    Muebles
                  </h4>
                  <SearchInput
                    value={mueSearch}
                    onChange={setMueSearch}
                    placeholder="Buscar mueble..."
                  />
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {loadingMue ? (
                      <div className="text-center py-4">
                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : (
                      muebles.map((m) => (
                        <MuebleCard
                          key={m.id_mue}
                          mueble={m}
                          isSelected={selectedMueble?.id_mue === m.id_mue}
                          onSelect={() => {
                            setSelectedMueble(m);
                            setSelectedMaterial(null);
                          }}
                        />
                      ))
                    )}
                  </div>
                  <MiniPagination
                    pagination={muePag}
                    onPageChange={(p) => fetchMuebles(p, mueSearch)}
                    isLoading={loadingMue}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-600" />
                Detalles del Movimiento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 text-violet-500" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={form.fecha_mov}
                    onChange={(e) =>
                      setForm({ ...form, fecha_mov: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-violet-500" />
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.cantidad}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cantidad: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    Stock Anterior
                  </label>
                  <input
                    type="number"
                    value={form.stock_anterior}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock_anterior: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    Stock Posterior
                  </label>
                  <input
                    type="number"
                    value={form.stock_posterior}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock_posterior: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText className="w-4 h-4 text-violet-500" />
                  Motivo
                </label>
                <textarea
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500"
                  placeholder="Motivo del movimiento..."
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Movimiento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200">
                  <div className="flex items-center gap-3 mb-2">
                    {form.tipo_mov === "Entrada" ? (
                      <ArrowUp className="w-6 h-6 text-green-600" />
                    ) : form.tipo_mov === "Salida" ? (
                      <ArrowDown className="w-6 h-6 text-red-600" />
                    ) : (
                      <RefreshCw className="w-6 h-6 text-amber-600" />
                    )}
                    <span className="font-semibold">Tipo</span>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      form.tipo_mov === "Entrada"
                        ? "text-green-600"
                        : form.tipo_mov === "Salida"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  >
                    {form.tipo_mov}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                    <span className="font-semibold">Empleado</span>
                  </div>
                  <p className="font-medium">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-3 mb-2">
                    {selectedMaterial ? (
                      <Boxes className="w-6 h-6 text-violet-600" />
                    ) : (
                      <Armchair className="w-6 h-6 text-indigo-600" />
                    )}
                    <span className="font-semibold">
                      {selectedMaterial ? "Material" : "Mueble"}
                    </span>
                  </div>
                  <p className="font-medium">
                    {selectedMaterial?.nom_mat || selectedMueble?.nom_mue}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Fecha</p>
                    <p className="font-bold">{form.fecha_mov}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cantidad</p>
                    <p className="text-lg font-bold text-violet-600">
                      {form.cantidad}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock Ant.</p>
                    <p className="font-bold">{form.stock_anterior}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock Post.</p>
                    <p className="font-bold">{form.stock_posterior}</p>
                  </div>
                </div>
              </div>
              {form.motivo && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200">
                  <p className="text-xs text-gray-500">Motivo:</p>
                  <p className="text-sm">{form.motivo}</p>
                </div>
              )}
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
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {isSubmitting ? "Guardando..." : "Confirmar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
