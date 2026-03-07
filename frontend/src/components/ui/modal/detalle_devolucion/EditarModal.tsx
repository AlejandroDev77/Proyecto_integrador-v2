import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  RotateCcw,
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
  Save,
} from "lucide-react";

interface DetalleDevolucion {
  id_det_dev: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_dev: number;
  id_mue: number;
  devolucion?: { cod_dev: string; fec_dev: string };
  mueble?: { nom_mue: string };
}
interface Devolucion {
  id_dev: number;
  cod_dev?: string;
  fec_dev: string;
  est_dev?: string;
  motivo?: string;
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
  detalledevolucionSeleccionado: DetalleDevolucion | null;
  setDetallesDevoluciones: React.Dispatch<
    React.SetStateAction<DetalleDevolucion[]>
  >;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "devolucion" | "mueble";

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
          ? "bg-white dark:bg-gray-900 text-red-600 border-t-2 border-x border-red-500 -mb-px"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 text-sm"
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

function DevolucionCard({
  devolucion,
  isSelected,
  onSelect,
}: {
  devolucion: Devolucion;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-red-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <RotateCcw className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">
            {devolucion.cod_dev}
          </p>
          <p className="font-medium text-sm">{devolucion.fec_dev}</p>
          {devolucion.motivo && (
            <p className="text-xs text-gray-500 truncate">
              {devolucion.motivo}
            </p>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-red-500" />}
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
          ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-rose-500 text-white"
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
        {isSelected && <Check className="w-5 h-5 text-rose-500" />}
      </div>
    </div>
  );
}

export default function ModalEditarDetalleDevolucion({
  showModal,
  setShowModal,
  detalledevolucionSeleccionado,
  setDetallesDevoluciones,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [form, setForm] = useState({ cantidad: 1, precio_unitario: 0 });
  const [selectedDevolucion, setSelectedDevolucion] =
    useState<Devolucion | null>(null);
  const [selectedMueble, setSelectedMueble] = useState<Mueble | null>(null);
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [devSearch, setDevSearch] = useState("");
  const [muebleSearch, setMuebleSearch] = useState("");
  const [devPag, setDevPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [mueblePag, setMueblePag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingDev, setLoadingDev] = useState(false);
  const [loadingMueble, setLoadingMueble] = useState(false);

  const fetchDevoluciones = useCallback(async (page = 1, search = "") => {
    setLoadingDev(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/devolucion?page=${page}&per_page=6${
          search ? `&filter[cod_dev]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setDevoluciones(p?.data || []);
      setDevPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setDevoluciones([]);
    } finally {
      setLoadingDev(false);
    }
  }, []);
  const fetchMuebles = useCallback(async (page = 1, search = "") => {
    setLoadingMueble(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/mueble?page=${page}&per_page=6${
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
      fetchDevoluciones();
      fetchMuebles();
    }
  }, [showModal, fetchDevoluciones, fetchMuebles]);
  useEffect(() => {
    const t = setTimeout(() => fetchDevoluciones(1, devSearch), 300);
    return () => clearTimeout(t);
  }, [devSearch, fetchDevoluciones]);
  useEffect(() => {
    const t = setTimeout(() => fetchMuebles(1, muebleSearch), 300);
    return () => clearTimeout(t);
  }, [muebleSearch, fetchMuebles]);

  useEffect(() => {
    if (detalledevolucionSeleccionado) {
      setForm({
        cantidad: detalledevolucionSeleccionado.cantidad,
        precio_unitario: detalledevolucionSeleccionado.precio_unitario,
      });
      setSelectedDevolucion({
        id_dev: detalledevolucionSeleccionado.id_dev,
        cod_dev: detalledevolucionSeleccionado.devolucion?.cod_dev,
        fec_dev: detalledevolucionSeleccionado.devolucion?.fec_dev || "",
      });
      setSelectedMueble({
        id_mue: detalledevolucionSeleccionado.id_mue,
        nom_mue: detalledevolucionSeleccionado.mueble?.nom_mue || "",
      });
    }
  }, [detalledevolucionSeleccionado]);

  const subtotal = form.cantidad * form.precio_unitario;
  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
    setValidationErrors(null);
    setGeneralError(null);
  };

  const handleSubmit = async () => {
    if (
      !detalledevolucionSeleccionado ||
      !selectedDevolucion ||
      !selectedMueble
    )
      return;
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
        `http://localhost:8000/api/detalle-devolucion/${detalledevolucionSeleccionado.id_det_dev}`,
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
            subtotal,
            id_dev: selectedDevolucion.id_dev,
            id_mue: selectedMueble.id_mue,
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

      setDetallesDevoluciones((prev) =>
        prev.map((d) =>
          d.id_det_dev === detalledevolucionSeleccionado.id_det_dev
            ? {
                ...responseData,
                devolucion: {
                  cod_dev: selectedDevolucion.cod_dev || "",
                  fec_dev: selectedDevolucion.fec_dev,
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
    } catch {
      setGeneralError(
        "Error de conexión. Por favor, verifique su conexión a internet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !detalledevolucionSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <RotateCcw className="w-6 h-6" />
            Editar Detalle de Devolución
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
            active={activeTab === "devolucion"}
            onClick={() => setActiveTab("devolucion")}
            icon={RotateCcw}
            label="Devolución"
          />
          <TabButton
            active={activeTab === "mueble"}
            onClick={() => setActiveTab("mueble")}
            icon={Armchair}
            label="Mueble"
          />
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
          {activeTab === "datos" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-red-500" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {subtotal.toFixed(2)} Bs.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <RotateCcw className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium">Devolución</span>
                  </div>
                  <p className="font-bold">
                    {selectedDevolucion?.cod_dev ||
                      `ID: ${selectedDevolucion?.id_dev}`}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <Armchair className="w-5 h-5 text-rose-600" />
                    <span className="text-sm font-medium">Mueble</span>
                  </div>
                  <p className="font-bold">
                    {selectedMueble?.nom_mue || `ID: ${selectedMueble?.id_mue}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "devolucion" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-red-600" />
                Cambiar Devolución
              </h3>
              <SearchInput
                value={devSearch}
                onChange={setDevSearch}
                placeholder="Buscar devolución..."
              />
              {loadingDev ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {devoluciones.length > 0 ? (
                      devoluciones.map((d) => (
                        <DevolucionCard
                          key={d.id_dev}
                          devolucion={d}
                          isSelected={selectedDevolucion?.id_dev === d.id_dev}
                          onSelect={() => setSelectedDevolucion(d)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron devoluciones</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={devPag}
                    onPageChange={(p) => fetchDevoluciones(p, devSearch)}
                    isLoading={loadingDev}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "mueble" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Armchair className="w-5 h-5 text-rose-600" />
                Cambiar Mueble
              </h3>
              <SearchInput
                value={muebleSearch}
                onChange={setMuebleSearch}
                placeholder="Buscar mueble..."
              />
              {loadingMueble ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
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
            disabled={isSubmitting || !selectedDevolucion || !selectedMueble}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
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

