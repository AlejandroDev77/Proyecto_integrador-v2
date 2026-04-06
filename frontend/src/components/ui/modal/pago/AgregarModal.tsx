import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  CreditCard,
  ShoppingBag,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  DollarSign,
  Calendar,
  FileText,
  ClipboardCheck,
  Wallet,
  Banknote,
  Smartphone,
  Building,
} from "lucide-react";

interface Pago {
  id_pag: number;
  fec_pag: string;
  monto: number;
  metodo_pag: string;
  referencia_pag: string;
  id_ven: number;
  venta?: {
    est_ven: string;
    total_ven: number;
  };
}

interface Venta {
  id_ven: number;
  cod_ven?: string;
  fec_ven: string;
  est_ven: string;
  total_ven: number;
  cliente?: { nom_cli: string; ap_pat_cli: string };
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setPagos: React.Dispatch<React.SetStateAction<Pago[]>>;
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
              className={`w-12 sm:w-20 h-1 mx-1 rounded transition-all duration-300 ${
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
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
  const getEstadoColor = (est: string) => {
    switch (est) {
      case "Completada":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Cancelada":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isSelected
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {venta.cod_ven}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {venta.fec_ven}
          </h4>
          {venta.cliente && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {venta.cliente.nom_cli} {venta.cliente.ap_pat_cli}
            </p>
          )}
          <div className="flex gap-2 mt-1 items-center">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${getEstadoColor(
                venta.est_ven
              )}`}
            >
              {venta.est_ven}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {venta.total_ven} Bs.
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-6 h-6 text-emerald-500 shrink-0" />}
      </div>
    </div>
  );
}

// Método Pago Button
function MetodoPagoButton({
  icon: Icon,
  label,
  value,
  selected,
  onSelect,
}: {
  icon: any;
  label: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          selected
            ? "bg-emerald-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span
        className={`text-sm font-medium ${
          selected
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default function ModalAgregarPago({
  showModal,
  setShowModal,
  setPagos,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fec_pag: new Date().toISOString().split("T")[0],
    monto: "",
    metodo_pag: "",
    referencia_pag: "",
  });
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);

  // Ventas
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasPagination, setVentasPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [ventasLoading, setVentasLoading] = useState(false);
  const [searchVenta, setSearchVenta] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const metodosPago = [
    { value: "Efectivo", label: "Efectivo", icon: Banknote },
    { value: "Tarjeta", label: "Tarjeta", icon: CreditCard },
    { value: "Transferencia", label: "Transferencia", icon: Building },
    { value: "QR", label: "QR", icon: Smartphone },
    { value: "Otro", label: "Otro", icon: Wallet },
  ];

  const steps = [
    { label: "Venta", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Monto", icon: <DollarSign className="w-4 h-4" /> },
    { label: "Método", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchVentas = useCallback(async (page: number, search: string = "") => {
    setVentasLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "6",
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

  useEffect(() => {
    if (showModal) {
      fetchVentas(1, "");
    }
  }, [showModal, fetchVentas]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchVentas(1, searchVenta), 300);
    return () => clearTimeout(timer);
  }, [searchVenta, showModal, fetchVentas]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedVenta(null);
    setForm({
      fec_pag: new Date().toISOString().split("T")[0],
      monto: "",
      metodo_pag: "",
      referencia_pag: "",
    });
    setValidationErrors(null);
    setGeneralError(null);
  };

  const handleSubmit = async () => {
    if (!selectedVenta || !form.monto || !form.metodo_pag) return;

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
      Accept: "application/json",
      ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
    };

    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);
    try {
      const pagoData = {
        ...form,
        monto: parseFloat(form.monto),
        id_ven: selectedVenta.id_ven,
      };
      const res = await fetch("http://localhost:8080/api/pago", {
        method: "POST",
        headers,
        body: JSON.stringify(pagoData),
      });

      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = { message: `Error del servidor (${res.status})` };
      }

      if (!res.ok) {
        const { fieldErrors, generalError: genError } =
          parseApiErrors(responseData);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      const updatedRes = await fetch("http://localhost:8080/api/pago");
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setPagos(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Pago registrado!",
        text: "El pago se ha guardado exitosamente.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose();
    } catch (err) {
      console.error("Error:", err);
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedVenta;
      case 2:
        return !!form.monto && Number(form.monto) > 0;
      case 3:
        return !!form.metodo_pag;
      default:
        return true;
    }
  };

  // Auto-fill monto con total de venta
  useEffect(() => {
    if (selectedVenta && step === 2 && !form.monto) {
      setForm((prev) => ({
        ...prev,
        monto: selectedVenta.total_ven.toString(),
      }));
    }
  }, [selectedVenta, step]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <CreditCard className="w-6 h-6" />
            Registrar Pago
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
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                Seleccionar Venta
              </h3>
              <SearchInput
                value={searchVenta}
                onChange={setSearchVenta}
                placeholder="Buscar por código..."
              />
              {ventasLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
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
            <div className="space-y-6">
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
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Detalles del Pago
              </h3>

              {selectedVenta && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Venta seleccionada
                      </p>
                      <p className="font-mono text-lg text-gray-900 dark:text-white">
                        {selectedVenta.cod_ven}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total de la venta
                      </p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedVenta.total_ven} Bs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Fecha del Pago *
                  </label>
                  <input
                    type="date"
                    value={form.fec_pag}
                    onChange={(e) =>
                      setForm({ ...form, fec_pag: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Monto a pagar *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Bs.
                    </span>
                    <input
                      type="number"
                      value={form.monto}
                      onChange={(e) =>
                        setForm({ ...form, monto: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Método de Pago
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {metodosPago.map((m) => (
                  <MetodoPagoButton
                    key={m.value}
                    icon={m.icon}
                    label={m.label}
                    value={m.value}
                    selected={form.metodo_pag === m.value}
                    onSelect={() => setForm({ ...form, metodo_pag: m.value })}
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Referencia / Número de Transacción
                </label>
                <input
                  type="text"
                  value={form.referencia_pag}
                  onChange={(e) =>
                    setForm({ ...form, referencia_pag: e.target.value })
                  }
                  placeholder="Ej: #12345, Recibo N°..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Confirmar Pago
              </h3>

              <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-emerald-100 text-sm">
                      Comprobante de Pago
                    </p>
                    <p className="font-mono text-2xl font-bold">
                      {selectedVenta?.cod_ven}
                    </p>
                  </div>
                  <CreditCard className="w-10 h-10 text-emerald-200" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-emerald-100 text-xs">Fecha</p>
                    <p className="font-medium">{form.fec_pag}</p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-xs">Método</p>
                    <p className="font-medium">{form.metodo_pag}</p>
                  </div>
                </div>
                <div className="border-t border-emerald-400/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Monto Total</span>
                    <span className="text-3xl font-bold">
                      {Number(form.monto).toFixed(2)} Bs.
                    </span>
                  </div>
                </div>
              </div>

              {form.referencia_pag && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Referencia
                  </p>
                  <p className="text-gray-900 dark:text-white font-mono">
                    {form.referencia_pag}
                  </p>
                </div>
              )}
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
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Registrar Pago
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
