import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  ShoppingCart,
  ShoppingBag,
  Armchair,
  Settings,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  Hash,
  DollarSign,
  Percent,
  Save,
} from "lucide-react";
import { ValidationErrors, parseApiErrors } from "../shared";

interface DetalleVenta {
  id_det_ven: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_ven: number;
  descuento_item: number;
  venta?: { fec_ven: string; est_ven: string };
  id_mue: number;
  mueble?: { nom_mue: string };
}
interface Venta {
  id_ven: number;
  cod_ven?: string;
  fec_ven: string;
  est_ven: string;
  total_ven?: number;
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
  precio_venta?: number;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  detalleSeleccionado: DetalleVenta | null;
  setDetallesVentas: React.Dispatch<React.SetStateAction<DetalleVenta[]>>;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "venta" | "mueble";

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
          ? "bg-white dark:bg-gray-900 text-amber-600 border-t-2 border-x border-amber-500 -mb-px"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 text-sm"
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
          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
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
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{venta.cod_ven}</p>
          <p className="font-medium text-sm">{venta.fec_ven}</p>
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
          ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
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
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{mueble.cod_mue}</p>
          <p className="font-medium text-sm truncate">{mueble.nom_mue}</p>
          {mueble.precio_venta && (
            <span className="text-xs text-green-600">
              {mueble.precio_venta} Bs.
            </span>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-orange-500" />}
      </div>
    </div>
  );
}

export default function ModalEditarDetalleVenta({
  showModal,
  setShowModal,
  detalleSeleccionado,
  setDetallesVentas,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
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

  const fetchVentas = useCallback(async (page = 1, search = "") => {
    setLoadingVenta(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/venta?page=${page}&per_page=6${
          search ? `&filter[cod_ven]=${encodeURIComponent(search)}` : ""
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
        `http://localhost:8080/api/mueble?page=${page}&per_page=6${
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
    if (detalleSeleccionado) {
      setForm({
        cantidad: detalleSeleccionado.cantidad,
        precio_unitario: detalleSeleccionado.precio_unitario,
        descuento_item: detalleSeleccionado.descuento_item || 0,
      });
      setSelectedVenta({
        id_ven: detalleSeleccionado.id_ven,
        fec_ven: detalleSeleccionado.venta?.fec_ven || "",
        est_ven: detalleSeleccionado.venta?.est_ven || "",
      });
      setSelectedMueble({
        id_mue: detalleSeleccionado.id_mue,
        nom_mue: detalleSeleccionado.mueble?.nom_mue || "",
      });
    }
  }, [detalleSeleccionado]);

  const subtotal = Math.max(
    0,
    form.cantidad * form.precio_unitario - form.cantidad * form.descuento_item
  );
  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
    setValidationErrors(null);
    setGeneralError(null);
  };

  const handleSubmit = async () => {
    if (!detalleSeleccionado || !selectedVenta || !selectedMueble) return;
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
      const res = await fetch(
        `http://localhost:8080/api/detalle-venta/${detalleSeleccionado.id_det_ven}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(uid ? { "X-USER-ID": uid } : {}),
          },
          body: JSON.stringify({
            cantidad: form.cantidad,
            precio_unitario: form.precio_unitario,
            descuento_item: form.descuento_item,
            subtotal,
            id_ven: selectedVenta.id_ven,
            id_mue: selectedMueble.id_mue,
          }),
        }
      );

      let responseData;
      try {
        responseData = await res.json();
      } catch {
        // Si no es JSON válido, crear un error genérico
        responseData = { message: `Error del servidor (${res.status})` };
      }

      if (!res.ok) {
        // Parsear errores de validación
        const { fieldErrors, generalError: genError } =
          parseApiErrors(responseData);
        setValidationErrors(fieldErrors);
        setGeneralError(genError);
        setIsSubmitting(false);
        return;
      }

      setDetallesVentas((prev) =>
        prev.map((d) =>
          d.id_det_ven === detalleSeleccionado.id_det_ven
            ? {
                ...responseData,
                venta: {
                  fec_ven: selectedVenta.fec_ven,
                  est_ven: selectedVenta.est_ven,
                },
                mueble: { nom_mue: selectedMueble.nom_mue },
              }
            : d
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !detalleSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Editar Detalle de Venta
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 bg-gray-50 dark:bg-gray-800/50 border-b">
          <TabButton
            active={activeTab === "datos"}
            onClick={() => setActiveTab("datos")}
            icon={Settings}
            label="Datos"
          />
          <TabButton
            active={activeTab === "venta"}
            onClick={() => setActiveTab("venta")}
            icon={ShoppingBag}
            label="Venta"
          />
          <TabButton
            active={activeTab === "mueble"}
            onClick={() => setActiveTab("mueble")}
            icon={Armchair}
            label="Mueble"
          />
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

          {activeTab === "datos" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Precio Unitario (Bs.)
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
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Percent className="w-4 h-4 text-amber-500" />
                    Descuento por Item (Bs.)
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
                <div className="flex items-end">
                  <div className="w-full p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {subtotal.toFixed(2)} Bs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium">
                      Venta seleccionada
                    </span>
                  </div>
                  <p className="font-bold">
                    {selectedVenta?.cod_ven || `ID: ${selectedVenta?.id_ven}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedVenta?.fec_ven}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <Armchair className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium">
                      Mueble seleccionado
                    </span>
                  </div>
                  <p className="font-bold">
                    {selectedMueble?.nom_mue || `ID: ${selectedMueble?.id_mue}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "venta" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                Cambiar Venta
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

          {activeTab === "mueble" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Armchair className="w-5 h-5 text-orange-600" />
                Cambiar Mueble
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
            disabled={isSubmitting || !selectedVenta || !selectedMueble}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
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
