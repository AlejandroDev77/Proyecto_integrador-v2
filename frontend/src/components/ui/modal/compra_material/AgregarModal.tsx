import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  ShoppingCart,
  Truck,
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
} from "lucide-react";

interface CompraMaterial {
  id_comp: number;
  cod_comp?: string;
  fec_comp: string;
  est_comp: string;
  total_comp: number;
  id_prov: number;
  id_emp: number;
}

interface Proveedor {
  id_prov: number;
  nom_prov: string;
  cod_prov?: string;
  tel_prov?: string;
  email_prov?: string;
}

interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  ap_mat_emp: string;
  cod_emp?: string;
}

interface Material {
  id_mat: number;
  nom_mat: string;
  cod_mat?: string;
  img_mat?: string;
  costo_mat: number;
  stock_mat: number;
  unidad_medida?: string;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setComprasMateriales: React.Dispatch<React.SetStateAction<CompraMaterial[]>>;
}

interface DetalleCompra {
  id_mat: number;
  nom_mat: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  img_mat?: string;
  unidad_medida?: string;
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
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
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
                  ? "text-amber-600 dark:text-amber-400"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
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

// Card de Proveedor
function ProveedorCard({
  proveedor,
  isSelected,
  onSelect,
}: {
  proveedor: Proveedor;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-amber-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-amber-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <Truck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {proveedor.cod_prov}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {proveedor.nom_prov}
          </h4>
          {proveedor.tel_prov && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tel: {proveedor.tel_prov}
            </p>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-amber-500 shrink-0" />}
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

// Card de Material
function MaterialCard({
  material,
  onAdd,
  isAdded,
}: {
  material: Material;
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
        {material.img_mat ? (
          <img
            src={material.img_mat}
            alt={material.nom_mat}
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
          {material.cod_mat || "N/A"}
        </p>
        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
          {material.nom_mat}
        </h4>
        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
          {Number(material.costo_mat || 0).toFixed(2)} Bs./
          {material.unidad_medida || "unidad"}
        </p>
      </div>
      <button
        onClick={onAdd}
        disabled={isAdded}
        className={`p-2 rounded-lg transition-colors ${
          isAdded
            ? "bg-green-500 text-white cursor-not-allowed"
            : "bg-amber-500 hover:bg-amber-600 text-white"
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
  detalle: DetalleCompra;
  onRemove: () => void;
  onUpdate: (field: string, value: number) => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        {detalle.img_mat && (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
            <img
              src={detalle.img_mat}
              alt={detalle.nom_mat}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {detalle.nom_mat}
          </h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            {Number(detalle.precio_unitario).toFixed(2)} Bs./
            {detalle.unidad_medida || "unidad"}
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
          <div className="py-1 px-2 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded">
            {Number(detalle.subtotal || 0).toFixed(2)} Bs.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModalAgregarCompraMaterial({
  showModal,
  setShowModal,
  setComprasMateriales,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fec_comp: new Date().toISOString().split("T")[0],
    est_comp: "Pendiente",
  });
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(
    null
  );
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [detalles, setDetalles] = useState<DetalleCompra[]>([]);

  // Proveedores
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedoresPagination, setProveedoresPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [proveedoresLoading, setProveedoresLoading] = useState(false);
  const [searchProveedor, setSearchProveedor] = useState("");

  // Empleados
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadosPagination, setEmpleadosPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [empleadosLoading, setEmpleadosLoading] = useState(false);
  const [searchEmpleado, setSearchEmpleado] = useState("");

  // Materiales
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [materialesPagination, setMaterialesPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [materialesLoading, setMaterialesLoading] = useState(false);
  const [searchMaterial, setSearchMaterial] = useState("");

  const steps = [
    { label: "Proveedor", icon: <Truck className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Materiales", icon: <Package className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  // Fetch functions
  const fetchProveedores = useCallback(
    async (page: number, search: string = "") => {
      setProveedoresLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
        });
        if (search) params.append("filter[nom_prov]", search);
        const res = await fetch(
          `http://localhost:8000/api/proveedor?${params}`
        );
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setProveedores(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setProveedoresPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch {
        setProveedores([]);
      } finally {
        setProveedoresLoading(false);
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

  const fetchMateriales = useCallback(
    async (page: number, search: string = "") => {
      setMaterialesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
        });
        if (search) params.append("filter[nom_mat]", search);
        const res = await fetch(
          `http://localhost:8000/api/materiales?${params}`
        );
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setMateriales(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setMaterialesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch {
        setMateriales([]);
      } finally {
        setMaterialesLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (showModal) {
      fetchProveedores(1, "");
      fetchEmpleados(1, "");
      fetchMateriales(1, "");
    }
  }, [showModal, fetchProveedores, fetchEmpleados, fetchMateriales]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchProveedores(1, searchProveedor), 300);
    return () => clearTimeout(timer);
  }, [searchProveedor, showModal, fetchProveedores]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchEmpleados(1, searchEmpleado), 300);
    return () => clearTimeout(timer);
  }, [searchEmpleado, showModal, fetchEmpleados]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchMateriales(1, searchMaterial), 300);
    return () => clearTimeout(timer);
  }, [searchMaterial, showModal, fetchMateriales]);

  const calcularTotal = () =>
    detalles.reduce((acc, d) => acc + Number(d.subtotal || 0), 0);

  const addMaterial = (material: Material) => {
    if (detalles.find((d) => d.id_mat === material.id_mat)) return;
    setDetalles([
      ...detalles,
      {
        id_mat: material.id_mat,
        nom_mat: material.nom_mat,
        cantidad: 1,
        precio_unitario: Number(material.costo_mat) || 0,
        subtotal: Number(material.costo_mat) || 0,
        img_mat: material.img_mat,
        unidad_medida: material.unidad_medida,
      },
    ]);
  };

  const updateDetalle = (id_mat: number, field: string, value: number) => {
    setDetalles(
      detalles.map((d) => {
        if (d.id_mat !== id_mat) return d;
        const updated = { ...d, [field]: value };
        if (field === "cantidad" || field === "precio_unitario") {
          updated.subtotal =
            Number(updated.cantidad) * Number(updated.precio_unitario);
        }
        return updated;
      })
    );
  };

  const removeDetalle = (id_mat: number) => {
    setDetalles(detalles.filter((d) => d.id_mat !== id_mat));
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedProveedor(null);
    setSelectedEmpleado(null);
    setDetalles([]);
    setForm({
      fec_comp: new Date().toISOString().split("T")[0],
      est_comp: "Pendiente",
    });
  };

  const handleSubmit = async () => {
    if (!selectedProveedor || !selectedEmpleado || detalles.length === 0)
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
      const compraData = {
        fec_comp: form.fec_comp,
        est_comp: form.est_comp,
        total_comp: calcularTotal(),
        id_prov: selectedProveedor.id_prov,
        id_emp: selectedEmpleado.id_emp,
      };
      const res = await fetch("http://localhost:8000/api/compra-material", {
        method: "POST",
        headers,
        body: JSON.stringify(compraData),
      });
      if (!res.ok) throw new Error("Error al crear la compra");
      const nuevaCompraPayload: any = await res.json();
      const nuevaCompra = nuevaCompraPayload?.data ?? nuevaCompraPayload;

      for (const det of detalles) {
        const detalleData = {
          id_comp: nuevaCompra.id_comp,
          id_mat: det.id_mat,
          cantidad: det.cantidad,
          precio_unitario: det.precio_unitario,
          subtotal: det.subtotal,
        };
        await fetch("http://localhost:8000/api/detalle-compra", {
          method: "POST",
          headers,
          body: JSON.stringify(detalleData),
        });
      }

      const updatedRes = await fetch(
        "http://localhost:8000/api/compra-material"
      );
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setComprasMateriales(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Compra registrada!",
        text: "La compra de materiales se ha guardado exitosamente.",
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
        text: "No se pudo registrar la compra.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedProveedor;
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
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Nueva Compra de Material
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
                <Truck className="w-5 h-5 text-amber-600" />
                Seleccionar Proveedor
              </h3>
              <SearchInput
                value={searchProveedor}
                onChange={setSearchProveedor}
                placeholder="Buscar proveedor..."
              />
              {proveedoresLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {proveedores.length > 0 ? (
                      proveedores.map((p) => (
                        <ProveedorCard
                          key={p.id_prov}
                          proveedor={p}
                          isSelected={selectedProveedor?.id_prov === p.id_prov}
                          onSelect={() => setSelectedProveedor(p)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron proveedores</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={proveedoresPagination}
                    onPageChange={(p) => fetchProveedores(p, searchProveedor)}
                    isLoading={proveedoresLoading}
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
                  Materiales Disponibles
                </h3>
                <SearchInput
                  value={searchMaterial}
                  onChange={setSearchMaterial}
                  placeholder="Buscar material..."
                />
                {materialesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto">
                      {materiales.length > 0 ? (
                        materiales.map((m) => (
                          <MaterialCard
                            key={m.id_mat}
                            material={m}
                            isAdded={detalles.some(
                              (d) => d.id_mat === m.id_mat
                            )}
                            onAdd={() => addMaterial(m)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-col items-center py-8 text-gray-500">
                          <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                          <p>No se encontraron materiales</p>
                        </div>
                      )}
                    </div>
                    <MiniPagination
                      pagination={materialesPagination}
                      onPageChange={(p) => fetchMateriales(p, searchMaterial)}
                      isLoading={materialesLoading}
                    />
                  </>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-600" />
                  Detalles ({detalles.length})
                </h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {detalles.length > 0 ? (
                    detalles.map((d) => (
                      <DetalleCard
                        key={d.id_mat}
                        detalle={d}
                        onRemove={() => removeDetalle(d.id_mat)}
                        onUpdate={(field, value) =>
                          updateDetalle(d.id_mat, field, value)
                        }
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed">
                      <Package className="w-12 h-12 mb-2 opacity-50" />
                      <p>Agrega materiales a la compra</p>
                    </div>
                  )}
                </div>
                {detalles.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
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
                    <Truck className="w-4 h-4 text-amber-600" />
                    Proveedor
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedProveedor?.nom_prov}
                  </p>
                  {selectedProveedor?.tel_prov && (
                    <p className="text-sm text-gray-500">
                      Tel: {selectedProveedor.tel_prov}
                    </p>
                  )}
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
                    value={form.fec_comp}
                    onChange={(e) =>
                      setForm({ ...form, fec_comp: e.target.value })
                    }
                    className="w-full py-1 px-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    Materiales ({detalles.length})
                  </h4>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-600 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-2 text-left">Material</th>
                      <th className="px-4 py-2 text-center">Cant.</th>
                      <th className="px-4 py-2 text-right">Precio</th>
                      <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {detalles.map((d) => (
                      <tr key={d.id_mat}>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {d.nom_mat}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-700 dark:text-gray-300">
                          {d.cantidad}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                          {d.precio_unitario} Bs.
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-amber-600">
                          {Number(d.subtotal || 0).toFixed(2)} Bs.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-xl border border-amber-300 dark:border-amber-700 flex justify-between items-center">
                <div>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Total de la Compra
                  </p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {calcularTotal().toFixed(2)} Bs.
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-amber-500/30" />
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
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-amber-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Registrar Compra
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
