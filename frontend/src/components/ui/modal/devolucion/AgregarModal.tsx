import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  RotateCcw,
  ShoppingBag,
  UserCheck,
  Package,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  DollarSign,
  Calendar,
  Receipt,
  FileText,
} from "lucide-react";

interface Devolucion {
  id_dev: number;
  cod_dev?: string;
  fec_dev: string;
  motivo_dev: string;
  total_dev: number;
  est_dev: string;
  id_ven: number;
  id_emp: number;
}

interface Venta {
  id_ven: number;
  cod_ven?: string;
  fec_ven: string;
  est_ven: string;
  total_ven: number;
  cliente?: { nom_cli: string; ap_pat_cli: string };
}

interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  ap_mat_emp: string;
  cod_emp?: string;
}

interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
  img_mue?: string;
  precio_venta: number;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setDevoluciones: React.Dispatch<React.SetStateAction<Devolucion[]>>;
}

interface DetalleDevolucion {
  id_mue: number;
  nom_mue: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  img_mue?: string;
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
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
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
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-1 mx-1 rounded transition-all duration-300 ${
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
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
          ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-red-500 text-white"
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
            <span className="text-xs text-blue-600">{venta.total_ven} Bs.</span>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-red-500 shrink-0" />}
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

// Card de Mueble
function MuebleCard({
  mueble,
  onAdd,
  isAdded,
}: {
  mueble: Mueble;
  onAdd: () => void;
  isAdded: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        isAdded
          ? "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
        {mueble.img_mue ? (
          <img
            src={mueble.img_mue}
            alt={mueble.nom_mue}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {mueble.cod_mue || "N/A"}
        </p>
        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
          {mueble.nom_mue}
        </h4>
        <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
          {mueble.precio_venta} Bs.
        </span>
      </div>
      <button
        onClick={onAdd}
        disabled={isAdded}
        className={`p-2 rounded-lg transition-colors ${
          isAdded
            ? "bg-green-500 text-white cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
    </div>
  );
}

// Card de Detalle
function DetalleCard({
  detalle,
  onRemove,
  onUpdate,
}: {
  detalle: DetalleDevolucion;
  onRemove: () => void;
  onUpdate: (field: string, value: number) => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        {detalle.img_mue && (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
            <img
              src={detalle.img_mue}
              alt={detalle.nom_mue}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {detalle.nom_mue}
          </h4>
          <p className="text-sm text-red-600 dark:text-red-400">
            {detalle.precio_unitario} Bs./und
          </p>
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-600 dark:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
            Cantidad
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                onUpdate("cantidad", Math.max(1, detalle.cantidad - 1))
              }
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min="1"
              value={detalle.cantidad}
              onChange={(e) =>
                onUpdate("cantidad", Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-14 text-center py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => onUpdate("cantidad", detalle.cantidad + 1)}
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
            Precio
          </label>
          <input
            type="number"
            min="0"
            value={detalle.precio_unitario}
            onChange={(e) =>
              onUpdate("precio_unitario", parseFloat(e.target.value) || 0)
            }
            className="w-full py-1 px-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
            Subtotal
          </label>
          <div className="py-1 px-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded">
            {Number(detalle.subtotal || 0).toFixed(2)} Bs.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModalAgregarDevolucion({
  showModal,
  setShowModal,
  setDevoluciones,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fec_dev: new Date().toISOString().split("T")[0],
    est_dev: "Pendiente",
    motivo_dev: "",
  });
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [detalles, setDetalles] = useState<DetalleDevolucion[]>([]);

  // Ventas
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasPagination, setVentasPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [ventasLoading, setVentasLoading] = useState(false);
  const [searchVenta, setSearchVenta] = useState("");

  // Empleados
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadosPagination, setEmpleadosPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [empleadosLoading, setEmpleadosLoading] = useState(false);
  const [searchEmpleado, setSearchEmpleado] = useState("");

  // Muebles
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [mueblesPagination, setMueblesPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [mueblesLoading, setMueblesLoading] = useState(false);
  const [searchMueble, setSearchMueble] = useState("");

  const steps = [
    { label: "Venta", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Productos", icon: <Package className="w-4 h-4" /> },
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
      const res = await fetch(`http://localhost:8000/api/venta?${params}`);
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

  const fetchMuebles = useCallback(
    async (page: number, search: string = "") => {
      setMueblesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
        });
        if (search) params.append("filter[nom_mue]", search);
        const res = await fetch(`http://localhost:8000/api/mueble?${params}`);
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setMuebles(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setMueblesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch {
        setMuebles([]);
      } finally {
        setMueblesLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (showModal) {
      fetchVentas(1, "");
      fetchEmpleados(1, "");
      fetchMuebles(1, "");
    }
  }, [showModal, fetchVentas, fetchEmpleados, fetchMuebles]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchVentas(1, searchVenta), 300);
    return () => clearTimeout(timer);
  }, [searchVenta, showModal, fetchVentas]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchEmpleados(1, searchEmpleado), 300);
    return () => clearTimeout(timer);
  }, [searchEmpleado, showModal, fetchEmpleados]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchMuebles(1, searchMueble), 300);
    return () => clearTimeout(timer);
  }, [searchMueble, showModal, fetchMuebles]);

  const calcularTotal = () =>
    detalles.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);

  const addMueble = (mueble: Mueble) => {
    if (detalles.find((d) => d.id_mue === mueble.id_mue)) return;
    setDetalles([
      ...detalles,
      {
        id_mue: mueble.id_mue,
        nom_mue: mueble.nom_mue,
        cantidad: 1,
        precio_unitario: mueble.precio_venta,
        subtotal: mueble.precio_venta,
        img_mue: mueble.img_mue,
      },
    ]);
  };

  const updateDetalle = (id_mue: number, field: string, value: number) => {
    setDetalles(
      detalles.map((d) => {
        if (d.id_mue !== id_mue) return d;
        const updated = { ...d, [field]: value };
        if (field === "cantidad" || field === "precio_unitario") {
          updated.subtotal =
            Number(updated.cantidad) * Number(updated.precio_unitario);
        }
        return updated;
      })
    );
  };

  const removeDetalle = (id_mue: number) => {
    setDetalles(detalles.filter((d) => d.id_mue !== id_mue));
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedVenta(null);
    setSelectedEmpleado(null);
    setDetalles([]);
    setForm({
      fec_dev: new Date().toISOString().split("T")[0],
      est_dev: "Pendiente",
      motivo_dev: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !selectedVenta ||
      !selectedEmpleado ||
      detalles.length === 0 ||
      !form.motivo_dev
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
      const devolucionData = {
        fec_dev: form.fec_dev,
        est_dev: form.est_dev,
        motivo_dev: form.motivo_dev,
        total_dev: calcularTotal(),
        id_ven: selectedVenta.id_ven,
        id_emp: selectedEmpleado.id_emp,
      };
      const res = await fetch("http://localhost:8000/api/devolucion", {
        method: "POST",
        headers,
        body: JSON.stringify(devolucionData),
      });
      if (!res.ok) throw new Error("Error al crear la devolución");
      const nuevaDevPayload: any = await res.json();
      const nuevaDev = nuevaDevPayload?.data ?? nuevaDevPayload;

      for (const det of detalles) {
        const detalleData = {
          id_dev: nuevaDev.id_dev,
          id_mue: det.id_mue,
          cantidad: det.cantidad,
          precio_unitario: det.precio_unitario,
          subtotal: det.subtotal,
        };
        await fetch("http://localhost:8000/api/detalle-devolucion", {
          method: "POST",
          headers,
          body: JSON.stringify(detalleData),
        });
      }

      const updatedRes = await fetch("http://localhost:8000/api/devolucion");
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setDevoluciones(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Devolución registrada!",
        text: "La devolución se ha guardado exitosamente.",
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
        text: "No se pudo registrar la devolución.",
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
        return !!selectedEmpleado;
      case 3:
        return detalles.length > 0;
      default:
        return true;
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <RotateCcw className="w-6 h-6" />
            Nueva Devolución
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
                <ShoppingBag className="w-5 h-5 text-red-600" />
                Seleccionar Venta
              </h3>
              <SearchInput
                value={searchVenta}
                onChange={setSearchVenta}
                placeholder="Buscar por código..."
              />
              {ventasLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
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
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Seleccionar Empleado
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

          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Productos a Devolver
                </h3>
                <SearchInput
                  value={searchMueble}
                  onChange={setSearchMueble}
                  placeholder="Buscar producto..."
                />
                {mueblesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto">
                      {muebles.length > 0 ? (
                        muebles.map((m) => (
                          <MuebleCard
                            key={m.id_mue}
                            mueble={m}
                            isAdded={detalles.some(
                              (d) => d.id_mue === m.id_mue
                            )}
                            onAdd={() => addMueble(m)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-col items-center py-8 text-gray-500">
                          <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                          <p>No se encontraron productos</p>
                        </div>
                      )}
                    </div>
                    <MiniPagination
                      pagination={mueblesPagination}
                      onPageChange={(p) => fetchMuebles(p, searchMueble)}
                      isLoading={mueblesLoading}
                    />
                  </>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-red-600" />
                  Detalles ({detalles.length})
                </h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {detalles.length > 0 ? (
                    detalles.map((d) => (
                      <DetalleCard
                        key={d.id_mue}
                        detalle={d}
                        onRemove={() => removeDetalle(d.id_mue)}
                        onUpdate={(field, value) =>
                          updateDetalle(d.id_mue, field, value)
                        }
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed">
                      <Package className="w-12 h-12 mb-2 opacity-50" />
                      <p>Agrega productos a devolver</p>
                    </div>
                  )}
                </div>
                {detalles.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        {calcularTotal().toFixed(2)} Bs.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    Venta
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-mono">
                    {selectedVenta?.cod_ven}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedVenta?.fec_ven}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    Empleado
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Fecha
                  </h4>
                  <input
                    type="date"
                    value={form.fec_dev}
                    onChange={(e) =>
                      setForm({ ...form, fec_dev: e.target.value })
                    }
                    className="w-full py-1 px-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Motivo de Devolución *
                </h4>
                <textarea
                  value={form.motivo_dev}
                  onChange={(e) =>
                    setForm({ ...form, motivo_dev: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe el motivo de la devolución..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    Productos ({detalles.length})
                  </h4>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-600 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-center">Cant.</th>
                      <th className="px-4 py-2 text-right">Precio</th>
                      <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {detalles.map((d) => (
                      <tr key={d.id_mue}>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {d.nom_mue}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                          {d.cantidad}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                          {d.precio_unitario} Bs.
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-red-600">
                          {Number(d.subtotal || 0).toFixed(2)} Bs.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl border border-red-300 dark:border-red-700 flex justify-between items-center">
                <div>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Total Devolución
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {calcularTotal().toFixed(2)} Bs.
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-red-500/30" />
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
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !form.motivo_dev}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-red-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Registrar Devolución
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
