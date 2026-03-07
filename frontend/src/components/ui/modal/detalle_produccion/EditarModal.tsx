import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Factory,
  Cog,
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
  CheckCircle,
  Save,
} from "lucide-react";

interface DetalleProduccion {
  id_det_prod: number;
  cantidad: number;
  estado: string;
  id_pro: number;
  id_mue: number;
  produccion?: { cod_pro: string; est_pro: string };
  mueble?: { nom_mue: string };
}
interface Produccion {
  id_pro: number;
  cod_pro?: string;
  fec_ini: string;
  est_pro: string;
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  detalleproduccionSeleccionado: DetalleProduccion | null;
  setDetallesProducciones: React.Dispatch<
    React.SetStateAction<DetalleProduccion[]>
  >;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "produccion" | "mueble";

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
          ? "bg-white dark:bg-gray-900 text-sky-600 border-t-2 border-x border-sky-500 -mb-px"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-500 text-sm"
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

function ProduccionCard({
  produccion,
  isSelected,
  onSelect,
}: {
  produccion: Produccion;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-sky-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Factory className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">
            {produccion.cod_pro}
          </p>
          <p className="font-medium text-sm">{produccion.fec_ini}</p>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              produccion.est_pro === "Completado"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {produccion.est_pro}
          </span>
        </div>
        {isSelected && <Check className="w-5 h-5 text-sky-500" />}
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
          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-cyan-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Armchair className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{mueble.cod_mue}</p>
          <p className="font-medium text-sm truncate">{mueble.nom_mue}</p>
        </div>
        {isSelected && <Check className="w-5 h-5 text-cyan-500" />}
      </div>
    </div>
  );
}

export default function ModalEditarDetalleProduccion({
  showModal,
  setShowModal,
  detalleproduccionSeleccionado,
  setDetallesProducciones,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ cantidad: 1, estado: "Pendiente" });
  const [selectedProduccion, setSelectedProduccion] =
    useState<Produccion | null>(null);
  const [selectedMueble, setSelectedMueble] = useState<Mueble | null>(null);
  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [prodSearch, setProdSearch] = useState("");
  const [muebleSearch, setMuebleSearch] = useState("");
  const [prodPag, setProdPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [mueblePag, setMueblePag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingProd, setLoadingProd] = useState(false);
  const [loadingMueble, setLoadingMueble] = useState(false);

  const estados = ["Pendiente", "En Proceso", "Completado", "Cancelado"];

  const fetchProducciones = useCallback(async (page = 1, search = "") => {
    setLoadingProd(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/produccion?page=${page}&per_page=6${
          search ? `&filter[cod_pro]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setProducciones(p?.data || []);
      setProdPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setProducciones([]);
    } finally {
      setLoadingProd(false);
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
      fetchProducciones();
      fetchMuebles();
    }
  }, [showModal, fetchProducciones, fetchMuebles]);
  useEffect(() => {
    const t = setTimeout(() => fetchProducciones(1, prodSearch), 300);
    return () => clearTimeout(t);
  }, [prodSearch, fetchProducciones]);
  useEffect(() => {
    const t = setTimeout(() => fetchMuebles(1, muebleSearch), 300);
    return () => clearTimeout(t);
  }, [muebleSearch, fetchMuebles]);

  useEffect(() => {
    if (detalleproduccionSeleccionado) {
      setForm({
        cantidad: detalleproduccionSeleccionado.cantidad,
        estado: detalleproduccionSeleccionado.estado || "Pendiente",
      });
      setSelectedProduccion({
        id_pro: detalleproduccionSeleccionado.id_pro,
        cod_pro: detalleproduccionSeleccionado.produccion?.cod_pro,
        fec_ini: "",
        est_pro: detalleproduccionSeleccionado.produccion?.est_pro || "",
      });
      setSelectedMueble({
        id_mue: detalleproduccionSeleccionado.id_mue,
        nom_mue: detalleproduccionSeleccionado.mueble?.nom_mue || "",
      });
    }
  }, [detalleproduccionSeleccionado]);

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
  };

  const handleSubmit = async () => {
    if (
      !detalleproduccionSeleccionado ||
      !selectedProduccion ||
      !selectedMueble
    )
      return;
    setIsSubmitting(true);
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}
    try {
      const res = await fetch(
        `http://localhost:8000/api/detalle-produccion/${detalleproduccionSeleccionado.id_det_prod}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(uid ? { "X-USER-ID": uid } : {}),
          },
          body: JSON.stringify({
            cantidad: form.cantidad,
            estado: form.estado,
            id_pro: selectedProduccion.id_pro,
            id_mue: selectedMueble.id_mue,
          }),
        }
      );
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      setDetallesProducciones((prev) =>
        prev.map((d) =>
          d.id_det_prod === detalleproduccionSeleccionado.id_det_prod
            ? {
                ...data,
                produccion: {
                  cod_pro: selectedProduccion.cod_pro || "",
                  est_pro: selectedProduccion.est_pro,
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
      Swal.fire({ icon: "error", title: "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !detalleproduccionSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Cog className="w-6 h-6" />
            Editar Detalle de Producción
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
            active={activeTab === "produccion"}
            onClick={() => setActiveTab("produccion")}
            icon={Factory}
            label="Producción"
          />
          <TabButton
            active={activeTab === "mueble"}
            onClick={() => setActiveTab("mueble")}
            icon={Armchair}
            label="Mueble"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "datos" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-sky-500" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CheckCircle className="w-4 h-4 text-sky-500" />
                    Estado
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {estados.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setForm({ ...form, estado: e })}
                        className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          form.estado === e
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700"
                            : "border-gray-200 dark:border-gray-700 text-gray-500"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <Factory className="w-5 h-5 text-sky-600" />
                    <span className="text-sm font-medium">Producción</span>
                  </div>
                  <p className="font-bold">
                    {selectedProduccion?.cod_pro ||
                      `ID: ${selectedProduccion?.id_pro}`}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-2 mb-1">
                    <Armchair className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm font-medium">Mueble</span>
                  </div>
                  <p className="font-bold">
                    {selectedMueble?.nom_mue || `ID: ${selectedMueble?.id_mue}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "produccion" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Factory className="w-5 h-5 text-sky-600" />
                Cambiar Producción
              </h3>
              <SearchInput
                value={prodSearch}
                onChange={setProdSearch}
                placeholder="Buscar producción..."
              />
              {loadingProd ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {producciones.length > 0 ? (
                      producciones.map((p) => (
                        <ProduccionCard
                          key={p.id_pro}
                          produccion={p}
                          isSelected={selectedProduccion?.id_pro === p.id_pro}
                          onSelect={() => setSelectedProduccion(p)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron producciones</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={prodPag}
                    onPageChange={(p) => fetchProducciones(p, prodSearch)}
                    isLoading={loadingProd}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "mueble" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Armchair className="w-5 h-5 text-cyan-600" />
                Cambiar Mueble
              </h3>
              <SearchInput
                value={muebleSearch}
                onChange={setMuebleSearch}
                placeholder="Buscar mueble..."
              />
              {loadingMueble ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
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
            disabled={isSubmitting || !selectedProduccion || !selectedMueble}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
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
