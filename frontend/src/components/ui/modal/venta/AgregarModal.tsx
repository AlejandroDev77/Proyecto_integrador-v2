import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import { Venta, Cliente, Empleado } from "../../../../types/venta";
import {
  ShoppingCart,
  Users,
  UserCheck,
  Package,
  CreditCard,
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
  FileText,
  Banknote,
  Wallet,
  Building2,
  Receipt,
} from "lucide-react";

interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
  img_mue?: string;
  precio_venta: number;
  stock: number;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setVentas: React.Dispatch<React.SetStateAction<Venta[]>>;
}

interface DetalleVenta {
  id_mue: number;
  nom_mue: string;
  cantidad: number;
  precio: number;
  descuento: number;
  subtotal: number;
  stock: number;
  img_mue?: string;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

// Componente Step Indicator
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
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
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
                  ? "text-emerald-600 dark:text-emerald-400"
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

// Componente SearchInput
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
      />
    </div>
  );
}

// Componente MiniPagination
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
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        {pagination.currentPage} / {pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Card de Cliente
function ClienteCard({
  cliente,
  isSelected,
  onSelect,
}: {
  cliente: Cliente;
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
          <Users className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {cliente.cod_cli}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {cliente.nom_cli} {cliente.ap_pat_cli}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            CI: {cliente.ci_cli}
          </p>
        </div>
        {isSelected && (
          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        )}
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
        {isSelected && (
          <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

// Card de Mueble para agregar
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
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
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
        <div className="flex gap-2 mt-1">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {mueble.precio_venta} Bs.
          </span>
          <span
            className={`text-xs ${
              mueble.stock > 0
                ? "text-gray-500 dark:text-gray-400"
                : "text-red-500"
            }`}
          >
            Stock: {mueble.stock}
          </span>
        </div>
      </div>
      <button
        onClick={onAdd}
        disabled={isAdded || mueble.stock <= 0}
        className={`p-2 rounded-lg transition-colors ${
          isAdded
            ? "bg-green-500 text-white cursor-not-allowed"
            : mueble.stock <= 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-600 text-white"
        }`}
      >
        {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
    </div>
  );
}

// Card de detalle seleccionado
function DetalleCard({
  detalle,
  onRemove,
  onUpdate,
}: {
  detalle: DetalleVenta;
  onRemove: () => void;
  onUpdate: (field: keyof DetalleVenta, value: number) => void;
}) {
  const maxQty = detalle.stock || 999;

  const handleCantidadChange = (newCantidad: number) => {
    const validCantidad = Math.max(1, Math.min(newCantidad, maxQty));
    onUpdate("cantidad", validCantidad);
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        {detalle.img_mue && (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
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
          <div className="flex items-center gap-2">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {detalle.precio} Bs./unidad
            </p>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                detalle.cantidad >= maxQty
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              Stock: {maxQty}
            </span>
          </div>
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
            Cantidad (máx: {maxQty})
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCantidadChange(detalle.cantidad - 1)}
              disabled={detalle.cantidad <= 1}
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min="1"
              max={maxQty}
              value={detalle.cantidad}
              onChange={(e) =>
                handleCantidadChange(parseInt(e.target.value) || 1)
              }
              className="w-14 text-center py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => handleCantidadChange(detalle.cantidad + 1)}
              disabled={detalle.cantidad >= maxQty}
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            value={detalle.precio}
            onChange={(e) =>
              onUpdate("precio", parseFloat(e.target.value) || 0)
            }
            className="w-full py-1 px-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
            Desc.
          </label>
          <input
            type="number"
            min="0"
            value={detalle.descuento}
            onChange={(e) =>
              onUpdate("descuento", parseFloat(e.target.value) || 0)
            }
            className="w-full py-1 px-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div className="mt-2 text-right text-sm font-semibold text-gray-900 dark:text-white">
        Subtotal:{" "}
        <span className="text-emerald-600 dark:text-emerald-400">
          {Number(detalle.subtotal || 0).toFixed(2)} Bs.
        </span>
      </div>
    </div>
  );
}

export default function ModalAgregarVenta({
  showModal,
  setShowModal,
  setVentas,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form data
  const [form, setForm] = useState({
    fec_ven: new Date().toISOString().split("T")[0],
    est_ven: "Pendiente",
    descuento: 0,
    notas: "",
  });

  // Selected entities
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);

  // Pago
  const [pago, setPago] = useState({
    fec_pag: new Date().toISOString().split("T")[0],
    metodo_pag: "",
    referencia_pag: "",
    monto: 0,
  });

  // Clientes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesPagination, setClientesPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [clientesLoading, setClientesLoading] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");

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
    { label: "Cliente", icon: <Users className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Productos", icon: <Package className="w-4 h-4" /> },
    { label: "Pago", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  // Fetch functions
  const fetchClientes = useCallback(
    async (page: number, search: string = "") => {
      setClientesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
        });
        if (search) params.append("filter[nom_cli]", search);
        const res = await fetch(`http://localhost:8080/api/clientes?${params}`);
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setClientes(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setClientesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch (error) {
        setClientes([]);
      } finally {
        setClientesLoading(false);
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
      } catch (error) {
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
        const res = await fetch(`http://localhost:8080/api/mueble?${params}`);
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
      } catch (error) {
        setMuebles([]);
      } finally {
        setMueblesLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    if (showModal) {
      fetchClientes(1, "");
      fetchEmpleados(1, "");
      fetchMuebles(1, "");
    }
  }, [showModal, fetchClientes, fetchEmpleados, fetchMuebles]);

  // Debounced search
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchClientes(1, searchCliente), 300);
    return () => clearTimeout(timer);
  }, [searchCliente, showModal, fetchClientes]);

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

  // Calculate total
  const calcularTotal = () => {
    const totalBruto = detalles.reduce(
      (acc, d) => acc + Number(d.subtotal || 0),
      0
    );
    return Number(totalBruto || 0) - Number(form.descuento || 0);
  };

  // Add mueble to detalles
  const addMueble = (mueble: Mueble) => {
    if (detalles.find((d) => d.id_mue === mueble.id_mue)) return;
    setDetalles([
      ...detalles,
      {
        id_mue: mueble.id_mue,
        nom_mue: mueble.nom_mue,
        cantidad: 1,
        precio: mueble.precio_venta,
        descuento: 0,
        subtotal: mueble.precio_venta,
        stock: mueble.stock,
        img_mue: mueble.img_mue,
      },
    ]);
  };

  // Update detalle
  const updateDetalle = (
    id_mue: number,
    field: keyof DetalleVenta,
    value: number
  ) => {
    setDetalles(
      detalles.map((d) => {
        if (d.id_mue !== id_mue) return d;
        const updated = { ...d, [field]: value };
        updated.subtotal =
          updated.cantidad * updated.precio - updated.descuento;
        return updated;
      })
    );
  };

  // Remove detalle
  const removeDetalle = (id_mue: number) => {
    setDetalles(detalles.filter((d) => d.id_mue !== id_mue));
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedCliente(null);
    setSelectedEmpleado(null);
    setDetalles([]);
    setForm({
      fec_ven: new Date().toISOString().split("T")[0],
      est_ven: "Pendiente",
      descuento: 0,
      notas: "",
    });
    setPago({
      fec_pag: new Date().toISOString().split("T")[0],
      metodo_pag: "",
      referencia_pag: "",
      monto: 0,
    });
    setValidationErrors(null);
    setGeneralError(null);
  };

  // Submit
  const handleSubmit = async () => {
    if (!selectedCliente || !selectedEmpleado || detalles.length === 0) return;

    let idUsuarioLocal = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload: any = jwtDecode(token);
        idUsuarioLocal = payload.id_usu || null;
      }
    } catch (e) {
      idUsuarioLocal = null;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
    };

    setIsSubmitting(true);

    try {
      // Create venta
      const ventaData = {
        fec_ven: form.fec_ven,
        est_ven: form.est_ven,
        total_ven: calcularTotal(),
        descuento: form.descuento,
        notas: form.notas,
        id_cli: selectedCliente.id_cli,
        id_emp: selectedEmpleado.id_emp,
      };

      const res = await fetch("http://localhost:8080/api/venta", {
        method: "POST",
        headers: { ...headers, Accept: "application/json" },
        body: JSON.stringify(ventaData),
      });

      let ventaCreadaPayload;
      try {
        ventaCreadaPayload = await res.json();
      } catch {
        ventaCreadaPayload = { message: `Error del servidor (${res.status})` };
      }

      if (!res.ok) {
        const { fieldErrors, generalError: genError } =
          parseApiErrors(ventaCreadaPayload);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setIsSubmitting(false);
        return;
      }

      const ventaCreada = ventaCreadaPayload?.data ?? ventaCreadaPayload;

      // Create detalles
      for (const det of detalles) {
        const detalleData = {
          id_ven: ventaCreada.id_ven,
          id_mue: det.id_mue,
          cantidad: det.cantidad,
          precio_unitario: det.precio,
          descuento: det.descuento,
          subtotal: det.subtotal,
        };
        await fetch("http://localhost:8080/api/detalle-venta", {
          method: "POST",
          headers: { ...headers, Accept: "application/json" },
          body: JSON.stringify(detalleData),
        });
      }

      // Create pago
      if (pago.metodo_pag && pago.monto > 0) {
        const pagoData = {
          id_ven: ventaCreada.id_ven,
          fec_pag: pago.fec_pag,
          metodo_pag: pago.metodo_pag,
          referencia_pag: pago.referencia_pag,
          monto: pago.monto,
        };
        await fetch("http://localhost:8080/api/pago", {
          method: "POST",
          headers: { ...headers, Accept: "application/json" },
          body: JSON.stringify(pagoData),
        });
      }

      // Refresh ventas
      const updatedRes = await fetch("http://localhost:8080/api/venta");
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setVentas(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Venta registrada!",
        text: "La venta se ha registrado exitosamente.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      handleClose();
    } catch (err) {
      console.error("Error al registrar venta:", err);
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validations
  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedCliente;
      case 2:
        return !!selectedEmpleado;
      case 3:
        return detalles.length > 0;
      case 4:
        return pago.metodo_pag !== "" && pago.monto > 0;
      default:
        return true;
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Nueva Venta
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {(validationErrors || generalError) && (
            <ValidationErrors
              errors={validationErrors}
              generalError={generalError}
              onDismiss={() => {
                setValidationErrors(null);
                setGeneralError(null);
              }}
              className="mb-4"
            />
          )}
          {/* Step 1: Cliente */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Seleccionar Cliente
              </h3>
              <SearchInput
                value={searchCliente}
                onChange={setSearchCliente}
                placeholder="Buscar cliente..."
              />
              {clientesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {clientes.length > 0 ? (
                      clientes.map((c) => (
                        <ClienteCard
                          key={c.id_cli}
                          cliente={c}
                          isSelected={selectedCliente?.id_cli === c.id_cli}
                          onSelect={() => setSelectedCliente(c)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron clientes</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={clientesPagination}
                    onPageChange={(p) => fetchClientes(p, searchCliente)}
                    isLoading={clientesLoading}
                  />
                </>
              )}
            </div>
          )}

          {/* Step 2: Empleado */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Seleccionar Empleado
              </h3>
              <SearchInput
                value={searchEmpleado}
                onChange={setSearchEmpleado}
                placeholder="Buscar empleado..."
              />
              {empleadosLoading ? (
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
                    pagination={empleadosPagination}
                    onPageChange={(p) => fetchEmpleados(p, searchEmpleado)}
                    isLoading={empleadosLoading}
                  />
                </>
              )}
            </div>
          )}

          {/* Step 3: Productos */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Muebles Disponibles
                </h3>
                <SearchInput
                  value={searchMueble}
                  onChange={setSearchMueble}
                  placeholder="Buscar mueble..."
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
                          <p>No se encontraron muebles</p>
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
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  Carrito ({detalles.length})
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
                      <ShoppingCart className="w-12 h-12 mb-2 opacity-50" />
                      <p>Agrega muebles al carrito</p>
                    </div>
                  )}
                </div>
                {detalles.length > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Subtotal:
                      </span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {Number(
                          detalles.reduce(
                            (acc, d) => acc + Number(d.subtotal || 0),
                            0
                          ) || 0
                        ).toFixed(2)}{" "}
                        Bs.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Pago */}
          {step === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Información del Pago
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        value: "Efectivo",
                        icon: <Banknote className="w-5 h-5" />,
                        label: "Efectivo",
                      },
                      {
                        value: "Tarjeta",
                        icon: <CreditCard className="w-5 h-5" />,
                        label: "Tarjeta",
                      },
                      {
                        value: "Transferencia",
                        icon: <Building2 className="w-5 h-5" />,
                        label: "Transfer.",
                      },
                    ].map((m) => (
                      <button
                        key={m.value}
                        onClick={() =>
                          setPago({ ...pago, metodo_pag: m.value })
                        }
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                          pago.metodo_pag === m.value
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                            : "border-gray-200 dark:border-gray-700 hover:border-amber-300"
                        }`}
                      >
                        {m.icon}
                        <span className="text-xs font-medium">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monto
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={pago.monto}
                      onChange={(e) =>
                        setPago({
                          ...pago,
                          monto: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Referencia (opcional)
                  </label>
                  <input
                    type="text"
                    value={pago.referencia_pag}
                    onChange={(e) =>
                      setPago({ ...pago, referencia_pag: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Nro. transacción, recibo, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descuento General
                  </label>
                  <input
                    type="number"
                    value={form.descuento}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        descuento: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={form.notas}
                    onChange={(e) =>
                      setForm({ ...form, notas: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Total a Pagar:
                  </span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {calcularTotal().toFixed(2)} Bs.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Resumen */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" /> Cliente
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedCliente?.nom_cli} {selectedCliente?.ap_pat_cli}
                  </p>
                  <p className="text-sm text-gray-500">
                    CI: {selectedCliente?.ci_cli}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" /> Empleado
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" /> Productos (
                    {detalles.length})
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
                          {d.precio} Bs.
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-emerald-600">
                          {Number(d.subtotal || 0).toFixed(2)} Bs.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-600" /> Pago
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Método: {pago.metodo_pag}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Monto: {pago.monto} Bs.
                  </p>
                  {pago.referencia_pag && (
                    <p className="text-sm text-gray-500">
                      Ref: {pago.referencia_pag}
                    </p>
                  )}
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-300 dark:border-emerald-700 flex flex-col justify-center">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Total Final
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {calcularTotal().toFixed(2)} Bs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-emerald-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirmar Venta
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
