import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Factory,
  X,
  Save,
  AlertCircle,
  Calendar,
  ShoppingBag,
  User,
  FileText,
  CheckCircle,
  Flag,
  ClipboardList,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Interfaces
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
  venta?: { fec_ven: string; est_ven: string };
  empleado?: { nom_emp: string; ap_pat_emp: string; ap_mat_emp: string };
  cotizacion?: { fec_cot: string; est_cot: string };
}
interface Venta {
  id_ven: number;
  fec_ven: string;
  est_ven: string;
  cod_ven?: string;
  total_ven: number;
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp?: string;
  ap_mat_emp?: string;
  cod_emp?: string;
}
interface Cotizacion {
  id_cot: number;
  fec_cot: string;
  est_cot: string;
  cod_cot?: string;
  total_cot: number;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  produccionSeleccionado: Produccion | null;
  setProducciones: React.Dispatch<React.SetStateAction<Produccion[]>>;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

// Components
function SearchInput({
  value,
  onChange,
  placeholder,
  color = "sky",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  color?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-${color}-500 text-sm`}
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
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        {pagination.currentPage} / {pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 text-gray-700 dark:text-gray-300"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

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
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-blue-500 shrink-0" />}
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
          <User className="w-5 h-5" />
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
          <ClipboardList className="w-5 h-5" />
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
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {cotizacion.est_cot}
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-emerald-500 shrink-0" />}
      </div>
    </div>
  );
}

const ModalEditarProduccion: React.FC<Props> = ({
  showModal,
  setShowModal,
  produccionSeleccionado,
  setProducciones,
}) => {
  const [form, setForm] = useState({
    fec_ini: "",
    fec_fin: "",
    fec_fin_estimada: "",
    est_pro: "",
    prioridad: "",
    notas: "",
  });
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [ventaSearch, setVentaSearch] = useState("");
  const [empleadoSearch, setEmpleadoSearch] = useState("");
  const [cotizacionSearch, setCotizacionSearch] = useState("");
  const [ventaPag, setVentaPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [empPag, setEmpPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [cotPag, setCotPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [loadingCot, setLoadingCot] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "form" | "venta" | "empleado" | "cotizacion"
  >("form");

  const fetchVentas = useCallback(async (page = 1, search = "") => {
    setLoadingVenta(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/venta?page=${page}&per_page=6${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      if (p?.data) {
        setVentas(p.data);
        setVentaPag({
          currentPage: p.current_page || 1,
          lastPage: p.last_page || 1,
          total: p.total || 0,
        });
      } else {
        setVentas(Array.isArray(p) ? p : []);
      }
    } catch {
      setVentas([]);
    } finally {
      setLoadingVenta(false);
    }
  }, []);
  const fetchEmpleados = useCallback(async (page = 1, search = "") => {
    setLoadingEmp(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/empleados?page=${page}&per_page=6${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      if (p?.data) {
        setEmpleados(p.data);
        setEmpPag({
          currentPage: p.current_page || 1,
          lastPage: p.last_page || 1,
          total: p.total || 0,
        });
      } else {
        setEmpleados(Array.isArray(p) ? p : []);
      }
    } catch {
      setEmpleados([]);
    } finally {
      setLoadingEmp(false);
    }
  }, []);
  const fetchCotizaciones = useCallback(async (page = 1, search = "") => {
    setLoadingCot(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/cotizacion?page=${page}&per_page=6${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      if (p?.data) {
        setCotizaciones(p.data);
        setCotPag({
          currentPage: p.current_page || 1,
          lastPage: p.last_page || 1,
          total: p.total || 0,
        });
      } else {
        setCotizaciones(Array.isArray(p) ? p : []);
      }
    } catch {
      setCotizaciones([]);
    } finally {
      setLoadingCot(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchVentas();
      fetchEmpleados();
      fetchCotizaciones();
    }
  }, [showModal, fetchVentas, fetchEmpleados, fetchCotizaciones]);
  useEffect(() => {
    const t = setTimeout(() => fetchVentas(1, ventaSearch), 300);
    return () => clearTimeout(t);
  }, [ventaSearch, fetchVentas]);
  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empleadoSearch), 300);
    return () => clearTimeout(t);
  }, [empleadoSearch, fetchEmpleados]);
  useEffect(() => {
    const t = setTimeout(() => fetchCotizaciones(1, cotizacionSearch), 300);
    return () => clearTimeout(t);
  }, [cotizacionSearch, fetchCotizaciones]);

  useEffect(() => {
    if (produccionSeleccionado) {
      setForm({
        fec_ini: produccionSeleccionado.fec_ini || "",
        fec_fin: produccionSeleccionado.fec_fin || "",
        fec_fin_estimada: produccionSeleccionado.fec_fin_estimada || "",
        est_pro: produccionSeleccionado.est_pro || "",
        prioridad: produccionSeleccionado.prioridad || "",
        notas: produccionSeleccionado.notas || "",
      });
      if (produccionSeleccionado.id_ven) {
        fetch(
          `http://localhost:8000/api/venta/${produccionSeleccionado.id_ven}`
        )
          .then((r) => r.json())
          .then((v) => setSelectedVenta(v?.data ?? v))
          .catch(() => {});
      }
      if (produccionSeleccionado.id_emp) {
        fetch(
          `http://localhost:8000/api/empleados/${produccionSeleccionado.id_emp}`
        )
          .then((r) => r.json())
          .then((e) => setSelectedEmpleado(e?.data ?? e))
          .catch(() => {});
      }
      if (produccionSeleccionado.id_cot) {
        fetch(
          `http://localhost:8000/api/cotizacion/${produccionSeleccionado.id_cot}`
        )
          .then((r) => r.json())
          .then((c) => setSelectedCotizacion(c?.data ?? c))
          .catch(() => {});
      }
    }
  }, [produccionSeleccionado]);

  const getDateValue = (dateStr: string) => {
    if (!dateStr) return null;
    const f = new Date(dateStr);
    f.setMinutes(f.getMinutes() + f.getTimezoneOffset());
    return f;
  };
  const handleDateChange = (field: string, date: Date | null) => {
    if (date) {
      const f = new Date(date);
      f.setMinutes(f.getMinutes() - f.getTimezoneOffset());
      setForm({ ...form, [field]: f.toISOString().split("T")[0] });
    } else {
      setForm({ ...form, [field]: "" });
    }
  };

  const handleSubmit = async () => {
    if (
      !produccionSeleccionado ||
      !selectedVenta ||
      !selectedEmpleado ||
      !selectedCotizacion
    ) {
      setErrorMsg("Seleccione venta, empleado y cotización.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    let idUsuarioLocal = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const p: any = jwtDecode(token);
        idUsuarioLocal = p.id_usu || null;
      }
    } catch {
      idUsuarioLocal = null;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/produccion/${produccionSeleccionado.id_pro}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
          },
          body: JSON.stringify({
            ...form,
            id_emp: selectedEmpleado.id_emp,
            id_ven: selectedVenta.id_ven,
            id_cot: selectedCotizacion.id_cot,
          }),
        }
      );
      if (!res.ok) {
        const e = await res.json();
        setErrorMsg(e.message || "Error");
        return;
      }
      const payload: any = await res.json();
      const data = payload?.data ?? payload;
      setProducciones((prev) =>
        prev.map((p) =>
          p.id_pro === data.id_pro
            ? {
                ...data,
                empleado: {
                  nom_emp: selectedEmpleado.nom_emp,
                  ap_pat_emp: selectedEmpleado.ap_pat_emp || "",
                  ap_mat_emp: selectedEmpleado.ap_mat_emp || "",
                },
                venta: {
                  fec_ven: selectedVenta.fec_ven,
                  est_ven: selectedVenta.est_ven,
                },
                cotizacion: {
                  fec_cot: selectedCotizacion.fec_cot,
                  est_cot: selectedCotizacion.est_cot,
                },
              }
            : p
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Producción actualizada!",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowModal(false);
    } catch (err) {
      setErrorMsg("Error al editar");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !produccionSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Factory className="w-6 h-6" />
            Editar Producción
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-lg">
              {produccionSeleccionado.cod_pro}
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            {
              key: "form",
              label: "Datos",
              icon: <Calendar className="w-4 h-4" />,
            },
            {
              key: "venta",
              label: "Venta",
              icon: <ShoppingBag className="w-4 h-4" />,
              selected: selectedVenta,
            },
            {
              key: "empleado",
              label: "Empleado",
              icon: <User className="w-4 h-4" />,
              selected: selectedEmpleado,
            },
            {
              key: "cotizacion",
              label: "Cotización",
              icon: <ClipboardList className="w-4 h-4" />,
              selected: selectedCotizacion,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as typeof activeSection)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === tab.key
                  ? "text-sky-600 border-b-2 border-sky-600 bg-sky-50 dark:bg-sky-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {(tab as any).selected && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{errorMsg}</span>
            </div>
          )}

          {activeSection === "form" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  Fecha Inicio
                </label>
                <DatePicker
                  selected={getDateValue(form.fec_ini)}
                  onChange={(d) => handleDateChange("fec_ini", d)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Fecha"
                  isClearable
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  Fecha Fin
                </label>
                <DatePicker
                  selected={getDateValue(form.fec_fin)}
                  onChange={(d) => handleDateChange("fec_fin", d)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Fecha"
                  isClearable
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  Fecha Estimada
                </label>
                <DatePicker
                  selected={getDateValue(form.fec_fin_estimada)}
                  onChange={(d) => handleDateChange("fec_fin_estimada", d)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Fecha"
                  isClearable
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  Estado
                </label>
                <select
                  value={form.est_pro}
                  onChange={(e) =>
                    setForm({ ...form, est_pro: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Seleccione</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Flag className="w-4 h-4 text-sky-500" />
                  Prioridad
                </label>
                <select
                  value={form.prioridad}
                  onChange={(e) =>
                    setForm({ ...form, prioridad: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Seleccione</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  Notas
                </label>
                <input
                  type="text"
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="md:col-span-3 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Resumen
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`p-2 rounded-lg border-2 ${
                      selectedVenta
                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <p className="text-xs text-gray-500">Venta</p>
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {selectedVenta ? selectedVenta.cod_ven : "—"}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg border-2 ${
                      selectedEmpleado
                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <p className="text-xs text-gray-500">Empleado</p>
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {selectedEmpleado ? selectedEmpleado.nom_emp : "—"}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg border-2 ${
                      selectedCotizacion
                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <p className="text-xs text-gray-500">Cotización</p>
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {selectedCotizacion ? selectedCotizacion.cod_cot : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "venta" && (
            <div>
              <SearchInput
                value={ventaSearch}
                onChange={setVentaSearch}
                placeholder="Buscar venta..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {loadingVenta ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  ventas.map((v) => (
                    <VentaCard
                      key={v.id_ven}
                      venta={v}
                      isSelected={selectedVenta?.id_ven === v.id_ven}
                      onSelect={() => setSelectedVenta(v)}
                    />
                  ))
                )}
              </div>
              <MiniPagination
                pagination={ventaPag}
                onPageChange={(p) => fetchVentas(p, ventaSearch)}
                isLoading={loadingVenta}
              />
            </div>
          )}
          {activeSection === "empleado" && (
            <div>
              <SearchInput
                value={empleadoSearch}
                onChange={setEmpleadoSearch}
                placeholder="Buscar empleado..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {loadingEmp ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  empleados.map((e) => (
                    <EmpleadoCard
                      key={e.id_emp}
                      empleado={e}
                      isSelected={selectedEmpleado?.id_emp === e.id_emp}
                      onSelect={() => setSelectedEmpleado(e)}
                    />
                  ))
                )}
              </div>
              <MiniPagination
                pagination={empPag}
                onPageChange={(p) => fetchEmpleados(p, empleadoSearch)}
                isLoading={loadingEmp}
              />
            </div>
          )}
          {activeSection === "cotizacion" && (
            <div>
              <SearchInput
                value={cotizacionSearch}
                onChange={setCotizacionSearch}
                placeholder="Buscar cotización..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {loadingCot ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  cotizaciones.map((c) => (
                    <CotizacionCard
                      key={c.id_cot}
                      cotizacion={c}
                      isSelected={selectedCotizacion?.id_cot === c.id_cot}
                      onSelect={() => setSelectedCotizacion(c)}
                    />
                  ))
                )}
              </div>
              <MiniPagination
                pagination={cotPag}
                onPageChange={(p) => fetchCotizaciones(p, cotizacionSearch)}
                isLoading={loadingCot}
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !selectedVenta ||
              !selectedEmpleado ||
              !selectedCotizacion
            }
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-sky-600/30"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarProduccion;
