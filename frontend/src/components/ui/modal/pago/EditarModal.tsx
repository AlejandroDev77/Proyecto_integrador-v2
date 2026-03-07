import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  CreditCard,
  X,
  Save,
  Calendar,
  ShoppingBag,
  DollarSign,
  FileText,
  Hash,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Interfaces
interface Pago {
  id_pag: number;
  cod_pag?: string;
  fec_pag: string;
  metodo_pag: string;
  referencia_pag: string;
  monto: number;
  id_ven: number;
  venta?: { est_ven: string; total_ven: number };
}
interface Venta {
  id_ven: number;
  est_ven: string;
  total_ven: number;
  cod_ven?: string;
  fec_ven?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  pagoSeleccionado: Pago | null;
  setPagos: React.Dispatch<React.SetStateAction<Pago[]>>;
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 text-sm"
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
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-green-500 text-white"
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
            <span className="text-xs text-green-600 font-medium">
              {venta.total_ven} Bs.
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-green-500 shrink-0" />}
      </div>
    </div>
  );
}

const ModalEditarPago: React.FC<Props> = ({
  showModal,
  setShowModal,
  pagoSeleccionado,
  setPagos,
}) => {
  const [form, setForm] = useState({
    fecha: "",
    metodo: "",
    referencia: "",
    monto: 0,
  });
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventaSearch, setVentaSearch] = useState("");
  const [ventaPagination, setVentaPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<"form" | "venta">("form");

  const fetchVentas = useCallback(async (page = 1, search = "") => {
    setLoadingVenta(true);
    try {
      const url = `http://localhost:8000/api/venta?page=${page}&per_page=6${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`;
      const res = await fetch(url);
      const payload = await res.json();
      if (payload?.data) {
        setVentas(payload.data);
        setVentaPagination({
          currentPage: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          total: payload.total || 0,
        });
      } else {
        setVentas(Array.isArray(payload) ? payload : []);
      }
    } catch {
      setVentas([]);
    } finally {
      setLoadingVenta(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchVentas();
    }
  }, [showModal, fetchVentas]);
  useEffect(() => {
    const t = setTimeout(() => fetchVentas(1, ventaSearch), 300);
    return () => clearTimeout(t);
  }, [ventaSearch, fetchVentas]);

  useEffect(() => {
    if (pagoSeleccionado) {
      const fechaLocal = new Date(pagoSeleccionado.fec_pag + "T00:00:00");
      setForm({
        fecha: fechaLocal.toISOString().split("T")[0],
        metodo: pagoSeleccionado.metodo_pag || "",
        referencia: pagoSeleccionado.referencia_pag || "",
        monto: pagoSeleccionado.monto || 0,
      });
      if (pagoSeleccionado.id_ven) {
        fetch(`http://localhost:8000/api/venta/${pagoSeleccionado.id_ven}`)
          .then((r) => r.json())
          .then((v) => setSelectedVenta(v?.data ?? v))
          .catch(() => {});
      }
    }
  }, [pagoSeleccionado]);

  const handleSubmit = async () => {
    if (!pagoSeleccionado || !selectedVenta) {
      setGeneralError("Seleccione una venta.");
      return;
    }
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

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
        `http://localhost:8000/api/pago/${pagoSeleccionado.id_pag}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(idUsuarioLocal ? { "X-USER-ID": idUsuarioLocal } : {}),
          },
          body: JSON.stringify({
            fec_pag: form.fecha,
            metodo_pag: form.metodo,
            referencia_pag: form.referencia,
            monto: form.monto,
            id_ven: selectedVenta.id_ven,
          }),
        }
      );

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
        setIsSubmitting(false);
        return;
      }

      const data = responseData?.data ?? responseData;
      setPagos((prev) =>
        prev.map((p) =>
          p.id_pag === data.id_pag
            ? {
                ...data,
                venta: {
                  est_ven: selectedVenta.est_ven,
                  total_ven: selectedVenta.total_ven,
                },
              }
            : p
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Pago actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowModal(false);
    } catch (err) {
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !pagoSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <CreditCard className="w-6 h-6" />
            Editar Pago
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-lg">
              {pagoSeleccionado.cod_pag}
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            {
              key: "form",
              label: "Datos del Pago",
              icon: <CreditCard className="w-4 h-4" />,
            },
            {
              key: "venta",
              label: "Venta Asociada",
              icon: <ShoppingBag className="w-4 h-4" />,
              selected: selectedVenta,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as typeof activeSection)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                activeSection === tab.key
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
              {(tab as any).selected && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </button>
          ))}
        </div>

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

          {activeSection === "form" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Fecha
                </label>
                <DatePicker
                  selected={
                    form.fecha ? new Date(form.fecha + "T00:00:00") : null
                  }
                  onChange={(date: Date | null) => {
                    if (date) {
                      const ld = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000
                      );
                      setForm({
                        ...form,
                        fecha: ld.toISOString().split("T")[0],
                      });
                    } else {
                      setForm({ ...form, fecha: "" });
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecciona fecha"
                  isClearable
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  Método de Pago
                </label>
                <select
                  value={form.metodo}
                  onChange={(e) => setForm({ ...form, metodo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccione</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="QR">QR</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Hash className="w-4 h-4 text-green-500" />
                  Referencia
                </label>
                <input
                  type="text"
                  value={form.referencia}
                  onChange={(e) =>
                    setForm({ ...form, referencia: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Monto (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.monto}
                  onChange={(e) =>
                    setForm({ ...form, monto: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Venta Asociada
                </h4>
                <div
                  className={`p-3 rounded-lg border-2 ${
                    selectedVenta
                      ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <p className="text-xs text-gray-500">Venta</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedVenta
                      ? `${selectedVenta.cod_ven} - ${selectedVenta.total_ven} Bs.`
                      : "No seleccionado"}
                  </p>
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
                pagination={ventaPagination}
                onPageChange={(p) => fetchVentas(p, ventaSearch)}
                isLoading={loadingVenta}
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
            disabled={isSubmitting || !selectedVenta}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-green-600/30"
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

export default ModalEditarPago;
