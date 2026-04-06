import { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Package,
  Layers,
  ClipboardCheck,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  DollarSign,
  Box,
  AlertCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface MuebleMaterial {
  id_mue_mat: number;
  id_mue: number;
  mueble?: {
    id_mue: number;
    cod_mue?: string;
    nom_mue: string;
    img_mue: string;
    precio_venta: number;
    precio_costo: number;
    stock: number;
  };
  id_mat: number;
  material?: {
    id_mat: number;
    cod_mat?: string;
    nom_mat: string;
    stock_mat: number;
    costo_mat: number;
    unidad_medida: string;
    img_mat: string;
  };
  cantidad: number;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setMueblesMateriales: React.Dispatch<React.SetStateAction<MuebleMaterial[]>>;
}

interface MaterialItem {
  id_mat: number;
  cantidad: number;
  nom_mat: string;
  stock_mat: number;
  costo_mat: number;
  unidad_medida: string;
}

interface MuebleData {
  id_mue: number;
  cod_mue?: string;
  nom_mue: string;
  img_mue?: string;
  precio_venta: number;
  precio_costo: number;
  stock: number;
}

interface MaterialData {
  id_mat: number;
  cod_mat?: string;
  nom_mat: string;
  stock_mat: number;
  costo_mat: number;
  unidad_medida: string;
  est_mat?: boolean;
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
    <div className="flex items-center justify-center w-full px-4 py-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {index + 1 < currentStep ? (
                <Check className="w-6 h-6" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                index + 1 === currentStep
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all duration-300 ${
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

// Componente MuebleCard
function MuebleCard({
  mueble,
  isSelected,
  onSelect,
}: {
  mueble: MuebleData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <Check className="w-4 h-4" />
        </div>
      )}
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {mueble.img_mue ? (
            <img
              src={mueble.img_mue}
              alt={mueble.nom_mue}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {mueble.cod_mue || "Sin código"}
          </p>
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {mueble.nom_mue}
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
              <DollarSign className="w-3 h-3" />
              {mueble.precio_venta} Bs.
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
              <Box className="w-3 h-3" />
              Stock: {mueble.stock}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente MaterialCard (disponible para agregar)
function MaterialAvailableCard({
  material,
  onAdd,
  isAdded,
}: {
  material: MaterialData;
  onAdd: () => void;
  isAdded: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
        isAdded
          ? "border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {material.cod_mat || "N/A"}
        </p>
        <h4 className="font-medium text-gray-900 dark:text-white truncate">
          {material.nom_mat}
        </h4>
        <div className="flex gap-2 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Stock: {material.stock_mat} {material.unidad_medida}
          </span>
          <span className="text-xs text-green-600 dark:text-green-400">
            {material.costo_mat} Bs.
          </span>
        </div>
      </div>
      <button
        onClick={onAdd}
        disabled={isAdded}
        className={`p-2 rounded-lg transition-colors ${
          isAdded
            ? "bg-green-500 text-white cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
    </div>
  );
}

// Componente MaterialSelectedCard
function MaterialSelectedCard({
  material,
  onRemove,
  onQuantityChange,
}: {
  material: MaterialItem;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
          {material.nom_mat}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {material.unidad_medida} • {material.costo_mat} Bs./unidad
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(Math.max(1, material.cantidad - 1))}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          min="1"
          value={material.cantidad}
          onChange={(e) =>
            onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-16 text-center py-1.5 px-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => onQuantityChange(material.cantidad + 1)}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onRemove}
        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
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
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
    <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Primera página"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400 px-3">
        <span className="font-semibold text-gray-900 dark:text-white">
          {pagination.currentPage}
        </span>
        {" / "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {pagination.lastPage}
        </span>
        <span className="ml-2 text-xs">({pagination.total} items)</span>
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Página siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Última página"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ModalAgregarMuebleMaterial({
  showModal,
  setShowModal,
  setMueblesMateriales,
}: Props) {
  const [step, setStep] = useState(1);
  const [selectedMueble, setSelectedMueble] = useState<MuebleData | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialItem[]>(
    []
  );

  // Muebles state
  const [muebles, setMuebles] = useState<MuebleData[]>([]);
  const [mueblesPagination, setMueblesPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [mueblesLoading, setMueblesLoading] = useState(false);
  const [searchMueble, setSearchMueble] = useState("");

  // Materiales state
  const [materiales, setMateriales] = useState<MaterialData[]>([]);
  const [materialesPagination, setMaterialesPagination] =
    useState<PaginationInfo>({
      currentPage: 1,
      lastPage: 1,
      total: 0,
    });
  const [materialesLoading, setMaterialesLoading] = useState(false);
  const [searchMaterial, setSearchMaterial] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { label: "Mueble", icon: <Package className="w-5 h-5" /> },
    { label: "Materiales", icon: <Layers className="w-5 h-5" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-5 h-5" /> },
  ];

  // Función para cargar muebles con paginación
  const fetchMuebles = useCallback(
    async (page: number, search: string = "") => {
      setMueblesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "12",
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
        console.error("Error fetching muebles:", error);
        setMuebles([]);
      } finally {
        setMueblesLoading(false);
      }
    },
    []
  );

  // Función para cargar materiales con paginación
  const fetchMateriales = useCallback(
    async (page: number, search: string = "") => {
      setMaterialesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "10",
        });
        if (search) params.append("filter[nom_mat]", search);

        const res = await fetch(
          `http://localhost:8080/api/materiales?${params}`
        );
        const payload = await res.json();

        const items = payload?.data ?? payload;
        const filtered = Array.isArray(items)
          ? items.filter((m: MaterialData) => m.est_mat !== false)
          : [];
        setMateriales(filtered);

        if (payload?.meta || payload?.last_page) {
          setMaterialesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? filtered.length,
          });
        }
      } catch (error) {
        console.error("Error fetching materiales:", error);
        setMateriales([]);
      } finally {
        setMaterialesLoading(false);
      }
    },
    []
  );

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (showModal) {
      fetchMuebles(1, "");
      fetchMateriales(1, "");
    }
  }, [showModal, fetchMuebles, fetchMateriales]);

  // Debounce search para muebles
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => {
      fetchMuebles(1, searchMueble);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchMueble, showModal, fetchMuebles]);

  // Debounce search para materiales
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => {
      fetchMateriales(1, searchMaterial);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchMaterial, showModal, fetchMateriales]);

  const handleMueblePageChange = (page: number) => {
    fetchMuebles(page, searchMueble);
  };

  const handleMaterialPageChange = (page: number) => {
    fetchMateriales(page, searchMaterial);
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedMueble(null);
    setSelectedMaterials([]);
    setSearchMueble("");
    setSearchMaterial("");
  };

  const handleAddMaterial = (material: MaterialData) => {
    if (selectedMaterials.find((m) => m.id_mat === material.id_mat)) return;
    setSelectedMaterials([
      ...selectedMaterials,
      {
        id_mat: material.id_mat,
        nom_mat: material.nom_mat,
        cantidad: 1,
        stock_mat: material.stock_mat,
        costo_mat: material.costo_mat,
        unidad_medida: material.unidad_medida,
      },
    ]);
  };

  const handleRemoveMaterial = (id_mat: number) => {
    setSelectedMaterials(selectedMaterials.filter((m) => m.id_mat !== id_mat));
  };

  const handleQuantityChange = (id_mat: number, cantidad: number) => {
    setSelectedMaterials(
      selectedMaterials.map((m) =>
        m.id_mat === id_mat ? { ...m, cantidad } : m
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedMueble || selectedMaterials.length === 0) return;

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
      for (const material of selectedMaterials) {
        const res = await fetch("http://localhost:8080/api/mueble-material", {
          method: "POST",
          headers,
          body: JSON.stringify({
            id_mue: selectedMueble.id_mue,
            id_mat: material.id_mat,
            cantidad: material.cantidad,
          }),
        });

        if (!res.ok) throw new Error("Error al crear mueble-material");
      }

      // Refrescar datos
      const updatedRes = await fetch(
        "http://localhost:8080/api/mueble-material"
      );
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setMueblesMateriales(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Materiales asignados!",
        html: `Se agregaron <b>${selectedMaterials.length}</b> material(es) al mueble <b>${selectedMueble.nom_mue}</b>`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      handleClose();
    } catch (err) {
      console.error("Error al agregar mueble-material:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron agregar los materiales. Intente nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="w-7 h-7" />
            Asignar Materiales a Mueble
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
          {/* Paso 1: Seleccionar Mueble */}
          {step === 1 && (
            <div className="space-y-4">
              <SearchInput
                value={searchMueble}
                onChange={setSearchMueble}
                placeholder="Buscar mueble por nombre o código..."
              />

              {mueblesLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    Cargando muebles...
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                    {muebles.length > 0 ? (
                      muebles.map((mueble) => (
                        <MuebleCard
                          key={mueble.id_mue}
                          mueble={mueble}
                          isSelected={selectedMueble?.id_mue === mueble.id_mue}
                          onSelect={() => setSelectedMueble(mueble)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
                        <p>No se encontraron muebles</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={mueblesPagination}
                    onPageChange={handleMueblePageChange}
                    isLoading={mueblesLoading}
                  />
                </>
              )}
            </div>
          )}

          {/* Paso 2: Agregar Materiales */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Panel izquierdo: Materiales disponibles */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Materiales Disponibles
                </h3>
                <SearchInput
                  value={searchMaterial}
                  onChange={setSearchMaterial}
                  placeholder="Buscar material..."
                />

                {materialesLoading ? (
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Cargando...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
                      {materiales.length > 0 ? (
                        materiales.map((material) => (
                          <MaterialAvailableCard
                            key={material.id_mat}
                            material={material}
                            isAdded={selectedMaterials.some(
                              (m) => m.id_mat === material.id_mat
                            )}
                            onAdd={() => handleAddMaterial(material)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                          <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                          <p>No se encontraron materiales</p>
                        </div>
                      )}
                    </div>
                    <MiniPagination
                      pagination={materialesPagination}
                      onPageChange={handleMaterialPageChange}
                      isLoading={materialesLoading}
                    />
                  </>
                )}
              </div>

              {/* Panel derecho: Materiales seleccionados */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-green-600" />
                  Materiales Seleccionados ({selectedMaterials.length})
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {selectedMaterials.length > 0 ? (
                    selectedMaterials.map((material) => (
                      <MaterialSelectedCard
                        key={material.id_mat}
                        material={material}
                        onRemove={() => handleRemoveMaterial(material.id_mat)}
                        onQuantityChange={(qty) =>
                          handleQuantityChange(material.id_mat, qty)
                        }
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <Layers className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-center">
                        Haz clic en <Plus className="w-4 h-4 inline" /> para
                        agregar materiales
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {step === 3 && selectedMueble && (
            <div className="space-y-6">
              {/* Resumen del Mueble */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Mueble Seleccionado
                </h3>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md flex-shrink-0">
                    {selectedMueble.img_mue ? (
                      <img
                        src={selectedMueble.img_mue}
                        alt={selectedMueble.nom_mue}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {selectedMueble.cod_mue}
                    </p>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedMueble.nom_mue}
                    </h4>
                    <div className="flex gap-3 mt-2">
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Precio: {selectedMueble.precio_venta} Bs.
                      </span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        Stock: {selectedMueble.stock}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Materiales */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-green-600" />
                  Materiales a Asignar ({selectedMaterials.length})
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Material
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Unidad
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedMaterials.map((material) => (
                        <tr key={material.id_mat}>
                          <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                            {material.nom_mat}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-900 dark:text-white">
                            {material.cantidad}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                            {material.unidad_medida}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !selectedMueble) ||
                (step === 2 && selectedMaterials.length === 0)
              }
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-green-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirmar Asignación
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
