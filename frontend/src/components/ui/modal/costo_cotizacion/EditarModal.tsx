import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  Edit3,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  DollarSign,
  Calculator,
  Settings,
  FileSearch,
} from "lucide-react";
import Swal from "sweetalert2";

interface Cotizacion {
  id_cot: number;
  cod_cot: string;
  fec_cot?: string;
  estado?: string;
  cliente?: { nom_cli?: string };
}

interface CostoCotizacion {
  id_costo: number;
  id_cot: number;
  costo_materiales?: number;
  costo_mano_obra?: number;
  costos_indirectos?: number;
  margen_ganancia?: number;
  costo_total?: number;
  precio_sugerido?: number;
  cotizacion?: { cod_cot?: string };
}

interface ModalEditarCostoCotizacionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  costoCotizacionSeleccionado: CostoCotizacion | null;
  setCostosCotizacion: React.Dispatch<React.SetStateAction<CostoCotizacion[]>>;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "cotizacion";

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
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        isSelected
          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-amber-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <FileSearch className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">
            {cotizacion.cod_cot}
          </p>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {cotizacion.cliente?.nom_cli || "Sin cliente"}
          </h4>
        </div>
        {isSelected && <Check className="w-6 h-6 text-amber-500" />}
      </div>
    </div>
  );
}

const ModalEditarCostoCotizacion: React.FC<ModalEditarCostoCotizacionProps> = ({
  showModal,
  setShowModal,
  costoCotizacionSeleccionado,
  setCostosCotizacion,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [loading, setLoading] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);
  const [cotSearch, setCotSearch] = useState("");
  const [cotPag, setCotPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingCot, setLoadingCot] = useState(false);
  const [formData, setFormData] = useState({
    costo_materiales: "",
    costo_mano_obra: "",
    costos_indirectos: "",
    margen_ganancia: "",
  });

  const fetchCotizaciones = useCallback(async (page = 1, search = "") => {
    setLoadingCot(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/cotizacion?page=${page}&per_page=6${
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

  useEffect(() => {
    if (showModal) {
      fetchCotizaciones();
    }
  }, [showModal, fetchCotizaciones]);

  useEffect(() => {
    const t = setTimeout(() => fetchCotizaciones(1, cotSearch), 300);
    return () => clearTimeout(t);
  }, [cotSearch, fetchCotizaciones]);

  useEffect(() => {
    if (costoCotizacionSeleccionado) {
      setFormData({
        costo_materiales: String(
          costoCotizacionSeleccionado.costo_materiales || ""
        ),
        costo_mano_obra: String(
          costoCotizacionSeleccionado.costo_mano_obra || ""
        ),
        costos_indirectos: String(
          costoCotizacionSeleccionado.costos_indirectos || ""
        ),
        margen_ganancia: String(
          costoCotizacionSeleccionado.margen_ganancia || ""
        ),
      });
      setSelectedCotizacion({
        id_cot: costoCotizacionSeleccionado.id_cot,
        cod_cot: costoCotizacionSeleccionado.cotizacion?.cod_cot || "",
      });
    }
  }, [costoCotizacionSeleccionado]);

  const costoTotal =
    Number(formData.costo_materiales || 0) +
    Number(formData.costo_mano_obra || 0) +
    Number(formData.costos_indirectos || 0);

  const precioSugerido =
    costoTotal * (1 + Number(formData.margen_ganancia || 0) / 100);

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
  };

  const handleSubmit = async () => {
    if (!costoCotizacionSeleccionado || !selectedCotizacion) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/costo-cotizacion/${costoCotizacionSeleccionado.id_costo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_cot: selectedCotizacion.id_cot,
            costo_materiales: Number(formData.costo_materiales) || 0,
            costo_mano_obra: Number(formData.costo_mano_obra) || 0,
            costos_indirectos: Number(formData.costos_indirectos) || 0,
            margen_ganancia: Number(formData.margen_ganancia) || 0,
            costo_total: costoTotal,
            precio_sugerido: precioSugerido,
          }),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar");

      const updatedCosto = await res.json();

      setCostosCotizacion((prev) =>
        prev.map((c) =>
          c.id_costo === costoCotizacionSeleccionado.id_costo
            ? {
                ...updatedCosto,
                cotizacion: { cod_cot: selectedCotizacion.cod_cot },
              }
            : c
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Costo actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error al guardar" });
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !costoCotizacionSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Edit3 className="w-6 h-6" />
            Editar Costo -{" "}
            {costoCotizacionSeleccionado.cotizacion?.cod_cot || ""}
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
            icon={FileSearch}
            label="Cotización"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "datos" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Costo Materiales (Bs)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costo_materiales}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costo_materiales: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Costo Mano de Obra (Bs)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costo_mano_obra}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costo_mano_obra: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Costos Indirectos (Bs)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costos_indirectos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costos_indirectos: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    Margen Ganancia (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.margen_ganancia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        margen_ganancia: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Costo Total:
                  </span>
                  <span className="font-semibold">
                    {costoTotal.toFixed(2)} Bs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Precio Sugerido:
                  </span>
                  <span className="font-bold text-lg text-amber-600">
                    {precioSugerido.toFixed(2)} Bs
                  </span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <FileSearch className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium">Cotización actual</span>
                </div>
                <p className="font-bold text-amber-600">
                  {selectedCotizacion?.cod_cot ||
                    `ID: ${selectedCotizacion?.id_cot}`}
                </p>
              </div>
            </div>
          )}

          {activeTab === "cotizacion" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-amber-600" />
                Cambiar Cotización
              </h3>
              <SearchInput
                value={cotSearch}
                onChange={setCotSearch}
                placeholder="Buscar por código..."
              />
              {loadingCot ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
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
            disabled={loading || !selectedCotizacion}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarCostoCotizacion;
