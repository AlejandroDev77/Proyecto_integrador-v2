import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  ShoppingCart,
  ShoppingBag,
  Armchair,
  Calculator,
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
  DollarSign,
  Percent,
} from "lucide-react";
import { ValidationErrors, parseApiErrors } from "../shared";

interface DetalleVenta {
  id_det_ven: number;
  cantidad: number;
  precio_unitario: number;
  descuento_item: number;
  subtotal: number;
  id_ven: number;
  id_mue: number;
  venta?: { fec_ven: string; est_ven: string };
  mueble?: { nom_mue: string };
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
  precio_mue?: number;
}
interface Venta {
  id_ven: number;
  fec_ven: string;
  est_ven: string;
  cod_ven?: string;
  total_ven?: number;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setDetallesVentas: React.Dispatch<React.SetStateAction<DetalleVenta[]>>;
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
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
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
                index + 1 === currentStep
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-500"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-sm"
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
        disabled={isLoading || pagination.currentPage === 1}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={isLoading || pagination.currentPage === 1}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs px-2">
        {pagination.currentPage}/{pagination.lastPage}
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={isLoading || pagination.currentPage === pagination.lastPage}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={isLoading || pagination.currentPage === pagination.lastPage}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
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
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
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
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-mono">{venta.cod_ven}</p>
          <h4 className="font-medium text-sm">{venta.fec_ven}</h4>
          <div className="flex gap-2">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                venta.est_ven === "Completado"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {venta.est_ven}
            </span>
            <span className="text-xs text-amber-600 font-medium">
              {venta.total_ven} Bs.
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-amber-500" />}
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
          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-orange-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Armchair className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-mono">{mueble.cod_mue}</p>
          <h4 className="font-medium text-sm truncate">{mueble.nom_mue}</h4>
          {mueble.precio_mue && (
            <span className="text-xs text-green-600 font-medium">
              {mueble.precio_mue} Bs.
            </span>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-orange-500" />}
      </div>
    </div>
  );
}

export default function ModalAgregarDetalleVenta({
  showModal,
  setShowModal,
  setDetallesVentas,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    cantidad: 1,
    precio_unitario: 0,
    descuento_item: 0,
  });
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [selectedMueble, setSelectedMueble] = useState<Mueble | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [ventaSearch, setVentaSearch] = useState("");
  const [muebleSearch, setMuebleSearch] = useState("");
  const [ventaPag, setVentaPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [mueblePag, setMueblePag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [loadingMueble, setLoadingMueble] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const steps = [
    { label: "Venta", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Mueble", icon: <Armchair className="w-4 h-4" /> },
    { label: "Detalles", icon: <Calculator className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchVentas = useCallback(async (page = 1, search = "") => {
    setLoadingVenta(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/venta?page=${page}&per_page=8${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setVentas(p?.data || []);
      setVentaPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setVentas([]);
    } finally {
      setLoadingVenta(false);
    }
  }, []);

  const fetchMuebles = useCallback(async (page = 1, search = "") => {
    setLoadingMueble(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/mueble?page=${page}&per_page=8${
          search ? `&filter[nom_mue]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setMuebles(p?.data || []);
      setMueblePag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setMuebles([]);
    } finally {
      setLoadingMueble(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchVentas();
      fetchMuebles();
    }
  }, [showModal, fetchVentas, fetchMuebles]);
  useEffect(() => {
    const t = setTimeout(() => fetchVentas(1, ventaSearch), 300);
    return () => clearTimeout(t);
  }, [ventaSearch, fetchVentas]);
  useEffect(() => {
    const t = setTimeout(() => fetchMuebles(1, muebleSearch), 300);
    return () => clearTimeout(t);
  }, [muebleSearch, fetchMuebles]);
  useEffect(() => {
    if (selectedMueble?.precio_mue)
      setForm((f) => ({
        ...f,
        precio_unitario: selectedMueble.precio_mue || 0,
      }));
  }, [selectedMueble]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedVenta(null);
    setSelectedMueble(null);
    setForm({ cantidad: 1, precio_unitario: 0, descuento_item: 0 });
    setValidationErrors(null);
    setGeneralError(null);
  };

  const subtotal =
    form.cantidad * form.precio_unitario - form.cantidad * form.descuento_item;

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedVenta;
      case 2:
        return !!selectedMueble;
      case 3:
        return form.cantidad > 0 && form.precio_unitario > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedVenta || !selectedMueble) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}

    try {
      const res = await fetch("http://localhost:8080/api/detalle-venta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(uid ? { "X-USER-ID": uid } : {}),
        },
        body: JSON.stringify({
          cantidad: form.cantidad,
          precio_unitario: form.precio_unitario,
          descuento_item: form.descuento_item,
          subtotal: subtotal > 0 ? subtotal : 0,
          id_ven: selectedVenta.id_ven,
          id_mue: selectedMueble.id_mue,
        }),
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = { message: `Error del servidor (${res.status})` };
      }

      if (!res.ok) {
        // Parsear errores de validación
        const { fieldErrors, generalError: genError } =
          parseApiErrors(responseData);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);

        // Si hay errores de campos, volver al paso de detalles
        if (
          fieldErrors &&
          Object.keys(fieldErrors).some((k) =>
            [
              "cantidad",
              "precio_unitario",
              "descuento_item",
              "subtotal",
            ].includes(k)
          )
        ) {
          setStep(3);
        }
        return;
      }

      const data = responseData?.data || responseData;
      setDetallesVentas((prev) => [
        ...prev,
        {
          ...data,
          venta: {
            fec_ven: selectedVenta.fec_ven,
            est_ven: selectedVenta.est_ven,
          },
          mueble: { nom_mue: selectedMueble.nom_mue },
        },
      ]);
      Swal.fire({
        icon: "success",
        title: "¡Detalle agregado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch (error) {
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Agregar Detalle de Venta
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Mostrar errores de validación */}
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

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                Seleccionar Venta
              </h3>
              <SearchInput
                value={ventaSearch}
                onChange={setVentaSearch}
                placeholder="Buscar venta..."
              />
              {loadingVenta ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
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
                    pagination={ventaPag}
                    onPageChange={(p) => fetchVentas(p, ventaSearch)}
                    isLoading={loadingVenta}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Armchair className="w-5 h-5 text-orange-600" />
                Seleccionar Mueble
              </h3>
              <SearchInput
                value={muebleSearch}
                onChange={setMuebleSearch}
                placeholder="Buscar mueble..."
              />
              {loadingMueble ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {muebles.length > 0 ? (
                      muebles.map((m) => (
                        <MuebleCard
                          key={m.id_mue}
                          mueble={m}
                          isSelected={selectedMueble?.id_mue === m.id_mue}
                          onSelect={() => setSelectedMueble(m)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron muebles</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={mueblePag}
                    onPageChange={(p) => fetchMuebles(p, muebleSearch)}
                    isLoading={loadingMueble}
                  />
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                Detalles del Ítem
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Hash className="w-4 h-4 text-amber-500" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Precio Unit. (Bs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.precio_unitario}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        precio_unitario: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Percent className="w-4 h-4 text-amber-500" />
                    Descuento/Item
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.descuento_item}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        descuento_item: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Subtotal:
                  </span>
                  <span className="text-2xl font-bold text-amber-600">
                    {(subtotal > 0 ? subtotal : 0).toFixed(2)} Bs.
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Detalle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="w-6 h-6 text-amber-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Venta
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedVenta?.cod_ven}
                  </p>
                  <p className="font-medium">{selectedVenta?.fec_ven}</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Armchair className="w-6 h-6 text-orange-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Mueble
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMueble?.cod_mue}
                  </p>
                  <p className="font-medium">{selectedMueble?.nom_mue}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Cantidad</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {form.cantidad}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio Unit.</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {form.precio_unitario} Bs.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Descuento</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {form.descuento_item} Bs.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="text-lg font-bold text-amber-600">
                      {(subtotal > 0 ? subtotal : 0).toFixed(2)} Bs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
