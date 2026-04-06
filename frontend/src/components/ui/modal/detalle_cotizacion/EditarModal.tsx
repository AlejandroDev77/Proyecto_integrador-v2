import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  FileText,
  ClipboardList,
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
  FileEdit,
  Wrench,
  Ruler,
  Palette,
  Package,
} from "lucide-react";

interface DetalleCotizacion {
  id_det_cot: number;
  cod_det_cot?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  desc_personalizacion?: string;
  id_cot: number;
  id_mue?: number | null;
  cotizacion?: { fec_cot: string; est_cot: string };
  mueble?: { nom_mue: string };
  nombre_mueble?: string;
  tipo_mueble?: string;
  dimensiones?: string;
  material_principal?: string;
  color_acabado?: string;
  img_referencia?: string;
  herrajes?: string;
}

interface Cotizacion {
  id_cot: number;
  cod_cot?: string;
  fec_cot: string;
  est_cot?: string;
  total_cot?: number;
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
  detallecotizacionSeleccionado: DetalleCotizacion | null;
  setDetallesCotizaciones: React.Dispatch<
    React.SetStateAction<DetalleCotizacion[]>
  >;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "cotizacion" | "mueble";

const TIPOS_MUEBLE = [
  "ropero",
  "cocina",
  "dormitorio",
  "escritorio",
  "estante",
  "baño",
  "sala",
  "otro",
];
const MATERIALES = [
  "Melamina 18mm",
  "Melamina 15mm",
  "MDF 18mm",
  "MDF 15mm",
  "Madera Maciza",
  "Aglomerado",
];
const COLORES = [
  "Blanco",
  "Negro",
  "Roble Oscuro",
  "Roble Claro",
  "Nogal",
  "Cerezo",
  "Gris",
  "Wengue",
];

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
          ? "bg-white dark:bg-gray-900 text-blue-600 border-t-2 border-x border-blue-500 -mb-px"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
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
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">
            {cotizacion.cod_cot}
          </p>
          <p className="font-medium text-sm">{cotizacion.fec_cot}</p>
          {cotizacion.total_cot && (
            <span className="text-xs text-green-600">
              {cotizacion.total_cot} Bs.
            </span>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-blue-500" />}
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
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
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
          <p className="font-medium text-sm truncate">{mueble.nom_mue}</p>
          {mueble.precio_venta && (
            <span className="text-xs text-green-600">
              {mueble.precio_venta} Bs.
            </span>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-indigo-500" />}
      </div>
    </div>
  );
}

export default function ModalEditarDetalleCotizacion({
  showModal,
  setShowModal,
  detallecotizacionSeleccionado,
  setDetallesCotizaciones,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modoMueble, setModoMueble] = useState<"catalogo" | "personalizado">(
    "catalogo"
  );

  const [form, setForm] = useState({
    cantidad: 1,
    precio_unitario: 0,
    desc_personalizacion: "",
  });

  const [customMueble, setCustomMueble] = useState({
    nombre_mueble: "",
    tipo_mueble: "ropero",
    dimensiones: "",
    material_principal: "Melamina 18mm",
    color_acabado: "Blanco",
    herrajes: "",
    img_referencia: "",
  });

  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);
  const [selectedMueble, setSelectedMueble] = useState<Mueble | null>(null);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [cotSearch, setCotSearch] = useState("");
  const [muebleSearch, setMuebleSearch] = useState("");
  const [cotPag, setCotPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [mueblePag, setMueblePag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingCot, setLoadingCot] = useState(false);
  const [loadingMueble, setLoadingMueble] = useState(false);

  const fetchCotizaciones = useCallback(async (page = 1, search = "") => {
    setLoadingCot(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/cotizacion?page=${page}&per_page=6${
          search ? `&filter[cod_cot]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setCotizaciones(p?.data || []);
      setCotPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setCotizaciones([]);
    } finally {
      setLoadingCot(false);
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
      fetchCotizaciones();
      fetchMuebles();
    }
  }, [showModal, fetchCotizaciones, fetchMuebles]);

  useEffect(() => {
    const t = setTimeout(() => fetchCotizaciones(1, cotSearch), 300);
    return () => clearTimeout(t);
  }, [cotSearch, fetchCotizaciones]);
  useEffect(() => {
    const t = setTimeout(() => fetchMuebles(1, muebleSearch), 300);
    return () => clearTimeout(t);
  }, [muebleSearch, fetchMuebles]);

  // Inicializar con datos seleccionados
  useEffect(() => {
    if (detallecotizacionSeleccionado) {
      setForm({
        cantidad: detallecotizacionSeleccionado.cantidad,
        precio_unitario: detallecotizacionSeleccionado.precio_unitario,
        desc_personalizacion:
          detallecotizacionSeleccionado.desc_personalizacion || "",
      });

      setSelectedCotizacion({
        id_cot: detallecotizacionSeleccionado.id_cot,
        fec_cot: detallecotizacionSeleccionado.cotizacion?.fec_cot || "",
        est_cot: detallecotizacionSeleccionado.cotizacion?.est_cot || "",
      });

      // Determinar si es mueble de catálogo o personalizado
      if (detallecotizacionSeleccionado.id_mue) {
        setModoMueble("catalogo");
        setSelectedMueble({
          id_mue: detallecotizacionSeleccionado.id_mue,
          nom_mue: detallecotizacionSeleccionado.mueble?.nom_mue || "",
        });
      } else {
        setModoMueble("personalizado");
        setCustomMueble({
          nombre_mueble: detallecotizacionSeleccionado.nombre_mueble || "",
          tipo_mueble: detallecotizacionSeleccionado.tipo_mueble || "ropero",
          dimensiones: detallecotizacionSeleccionado.dimensiones || "",
          material_principal:
            detallecotizacionSeleccionado.material_principal || "Melamina 18mm",
          color_acabado:
            detallecotizacionSeleccionado.color_acabado || "Blanco",
          herrajes: detallecotizacionSeleccionado.herrajes || "",
          img_referencia: detallecotizacionSeleccionado.img_referencia || "",
        });
      }
    }
  }, [detallecotizacionSeleccionado]);

  const subtotal = form.cantidad * form.precio_unitario;

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
  };

  const handleSubmit = async () => {
    if (!detallecotizacionSeleccionado || !selectedCotizacion) return;
    if (modoMueble === "catalogo" && !selectedMueble) return;
    if (modoMueble === "personalizado" && !customMueble.nombre_mueble) return;

    setIsSubmitting(true);
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) uid = (jwtDecode(token) as any).id_usu;
    } catch {}

    try {
      const payload: any = {
        cantidad: form.cantidad,
        precio_unitario: form.precio_unitario,
        desc_personalizacion: form.desc_personalizacion,
        subtotal,
        id_cot: selectedCotizacion.id_cot,
      };

      if (modoMueble === "catalogo" && selectedMueble) {
        payload.id_mue = selectedMueble.id_mue;
        payload.nombre_mueble = null;
        payload.tipo_mueble = null;
        payload.dimensiones = null;
        payload.material_principal = null;
        payload.color_acabado = null;
        payload.herrajes = null;
        payload.img_referencia = null;
      } else {
        payload.id_mue = null;
        payload.nombre_mueble = customMueble.nombre_mueble;
        payload.tipo_mueble = customMueble.tipo_mueble;
        payload.dimensiones = customMueble.dimensiones;
        payload.material_principal = customMueble.material_principal;
        payload.color_acabado = customMueble.color_acabado;
        payload.herrajes = customMueble.herrajes;
        payload.img_referencia = customMueble.img_referencia;
      }

      const res = await fetch(
        `http://localhost:8080/api/detalle-cotizacion/${detallecotizacionSeleccionado.id_det_cot}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(uid ? { "X-USER-ID": uid } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Error");
      const data = await res.json();

      setDetallesCotizaciones((prev) =>
        prev.map((d) =>
          d.id_det_cot === detallecotizacionSeleccionado.id_det_cot
            ? {
                ...data,
                cotizacion: {
                  fec_cot: selectedCotizacion.fec_cot,
                  est_cot: selectedCotizacion.est_cot || "",
                },
                mueble: selectedMueble
                  ? { nom_mue: selectedMueble.nom_mue }
                  : undefined,
                nombre_mueble:
                  modoMueble === "personalizado"
                    ? customMueble.nombre_mueble
                    : undefined,
                tipo_mueble:
                  modoMueble === "personalizado"
                    ? customMueble.tipo_mueble
                    : undefined,
                dimensiones:
                  modoMueble === "personalizado"
                    ? customMueble.dimensiones
                    : undefined,
                material_principal:
                  modoMueble === "personalizado"
                    ? customMueble.material_principal
                    : undefined,
                color_acabado:
                  modoMueble === "personalizado"
                    ? customMueble.color_acabado
                    : undefined,
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
      Swal.fire({ icon: "error", title: "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !detallecotizacionSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Editar Detalle de Cotización
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
            active={activeTab === "cotizacion"}
            onClick={() => setActiveTab("cotizacion")}
            icon={ClipboardList}
            label="Cotización"
          />
          <TabButton
            active={activeTab === "mueble"}
            onClick={() => setActiveTab("mueble")}
            icon={Armchair}
            label="Mueble"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab Datos */}
          {activeTab === "datos" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-blue-500" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileEdit className="w-4 h-4 text-blue-500" />
                  Descripción Personalización
                </label>
                <textarea
                  value={form.desc_personalizacion}
                  onChange={(e) =>
                    setForm({ ...form, desc_personalizacion: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                  placeholder="Detalles de personalización..."
                />
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {subtotal.toFixed(2)} Bs.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Cotización</span>
                  </div>
                  <p className="font-bold">
                    {selectedCotizacion?.cod_cot ||
                      `ID: ${selectedCotizacion?.id_cot}`}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <Armchair className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium">Mueble</span>
                  </div>
                  <p className="font-bold">
                    {modoMueble === "catalogo"
                      ? selectedMueble?.nom_mue
                      : customMueble.nombre_mueble}
                  </p>
                  {modoMueble === "personalizado" && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      Personalizado
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Cotización */}
          {activeTab === "cotizacion" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Cambiar Cotización
              </h3>
              <SearchInput
                value={cotSearch}
                onChange={setCotSearch}
                placeholder="Buscar cotización..."
              />
              {loadingCot ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {cotizaciones.length > 0 ? (
                      cotizaciones.map((c) => (
                        <CotizacionCard
                          key={c.id_cot}
                          cotizacion={c}
                          isSelected={selectedCotizacion?.id_cot === c.id_cot}
                          onSelect={() => setSelectedCotizacion(c)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron cotizaciones</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={cotPag}
                    onPageChange={(p) => fetchCotizaciones(p, cotSearch)}
                    isLoading={loadingCot}
                  />
                </>
              )}
            </div>
          )}

          {/* Tab Mueble */}
          {activeTab === "mueble" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Armchair className="w-5 h-5 text-indigo-600" />
                Cambiar Mueble
              </h3>

              {/* Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setModoMueble("catalogo")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    modoMueble === "catalogo"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Armchair className="w-8 h-8 text-blue-600" />
                  <span className="font-medium">Del Catálogo</span>
                </button>
                <button
                  onClick={() => setModoMueble("personalizado")}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    modoMueble === "personalizado"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Wrench className="w-8 h-8 text-purple-600" />
                  <span className="font-medium">Personalizado</span>
                </button>
              </div>

              {modoMueble === "catalogo" ? (
                <>
                  <SearchInput
                    value={muebleSearch}
                    onChange={setMuebleSearch}
                    placeholder="Buscar mueble..."
                  />
                  {loadingMueble ? (
                    <div className="flex justify-center py-12">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
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
                </>
              ) : (
                <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Tipo
                      </label>
                      <select
                        value={customMueble.tipo_mueble}
                        onChange={(e) =>
                          setCustomMueble({
                            ...customMueble,
                            tipo_mueble: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      >
                        {TIPOS_MUEBLE.map((t) => (
                          <option key={t} value={t} className="capitalize">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nombre *</label>
                      <input
                        type="text"
                        value={customMueble.nombre_mueble}
                        onChange={(e) =>
                          setCustomMueble({
                            ...customMueble,
                            nombre_mueble: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      Dimensiones
                    </label>
                    <input
                      type="text"
                      value={customMueble.dimensiones}
                      onChange={(e) =>
                        setCustomMueble({
                          ...customMueble,
                          dimensiones: e.target.value,
                        })
                      }
                      placeholder="Ej: 2.40m × 1.80m × 0.60m"
                      className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Material
                      </label>
                      <select
                        value={customMueble.material_principal}
                        onChange={(e) =>
                          setCustomMueble({
                            ...customMueble,
                            material_principal: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      >
                        {MATERIALES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Palette className="w-4 h-4" />
                        Color
                      </label>
                      <select
                        value={customMueble.color_acabado}
                        onChange={(e) =>
                          setCustomMueble({
                            ...customMueble,
                            color_acabado: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                      >
                        {COLORES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Wrench className="w-4 h-4" />
                      Herrajes
                    </label>
                    <input
                      type="text"
                      value={customMueble.herrajes}
                      onChange={(e) =>
                        setCustomMueble({
                          ...customMueble,
                          herrajes: e.target.value,
                        })
                      }
                      placeholder="Ej: Correderas telescópicas"
                      className="w-full mt-1 px-3 py-2 rounded-lg border dark:bg-gray-800"
                    />
                  </div>
                </div>
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
            disabled={
              isSubmitting ||
              !selectedCotizacion ||
              (modoMueble === "catalogo"
                ? !selectedMueble
                : !customMueble.nombre_mueble)
            }
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
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
