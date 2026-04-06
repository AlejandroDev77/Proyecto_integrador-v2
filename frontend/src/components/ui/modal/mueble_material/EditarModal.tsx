import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Package,
  Layers,
  X,
  Check,
  Search,
  Save,
  Image as ImageIcon,
  DollarSign,
  Box,
  AlertCircle,
  Hash,
  ChevronLeft,
  ChevronRight,
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
  mueblematerialSeleccionado: MuebleMaterial | null;
  setMueblesMateriales: React.Dispatch<React.SetStateAction<MuebleMaterial[]>>;
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

// Componente SearchInput reutilizable
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
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
    <div className="flex items-center justify-center gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onPageChange(1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Primera"
      >
        <ChevronsLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1 || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Anterior"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        <span className="font-semibold">{pagination.currentPage}</span>
        {" / "}
        <span className="font-semibold">{pagination.lastPage}</span>
      </span>
      <button
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Siguiente"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onPageChange(pagination.lastPage)}
        disabled={pagination.currentPage === pagination.lastPage || isLoading}
        className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
        title="Última"
      >
        <ChevronsRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Componente MuebleCard para selección
function MuebleSelectCard({
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
      className={`relative cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5">
          <Check className="w-3 h-3" />
        </div>
      )}
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {mueble.img_mue ? (
            <img
              src={mueble.img_mue}
              alt={mueble.nom_mue}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {mueble.cod_mue || "N/A"}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {mueble.nom_mue}
          </h4>
          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
            <DollarSign className="w-3 h-3" />
            {mueble.precio_venta} Bs.
          </span>
        </div>
      </div>
    </div>
  );
}

// Componente MaterialCard para selección
function MaterialSelectCard({
  material,
  isSelected,
  onSelect,
}: {
  material: MaterialData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {material.cod_mat || "N/A"}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {material.nom_mat}
          </h4>
          <div className="flex gap-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Stock: {material.stock_mat}
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">
              {material.costo_mat} Bs.
            </span>
          </div>
        </div>
        {isSelected && (
          <div className="bg-green-500 text-white rounded-full p-1 flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModalEditarMuebleMaterial({
  showModal,
  setShowModal,
  mueblematerialSeleccionado,
  setMueblesMateriales,
}: Props) {
  const [formData, setFormData] = useState({
    id_mue_mat: 0,
    id_mue: 0,
    id_mat: 0,
    cantidad: 1,
  });

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

  // Función para cargar muebles con paginación
  const fetchMuebles = useCallback(
    async (page: number, search: string = "") => {
      setMueblesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "8",
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
          per_page: "8",
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

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (showModal && mueblematerialSeleccionado) {
      setFormData({
        id_mue_mat: mueblematerialSeleccionado.id_mue_mat,
        id_mue: mueblematerialSeleccionado.id_mue,
        id_mat: mueblematerialSeleccionado.id_mat,
        cantidad: mueblematerialSeleccionado.cantidad,
      });

      fetchMuebles(1, "");
      fetchMateriales(1, "");
    }
  }, [showModal, mueblematerialSeleccionado, fetchMuebles, fetchMateriales]);

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

  // Obtener datos seleccionados
  const selectedMueble = muebles.find((m) => m.id_mue === formData.id_mue);
  const selectedMaterial = materiales.find((m) => m.id_mat === formData.id_mat);

  const handleSubmit = async () => {
    if (!formData.id_mue || !formData.id_mat || formData.cantidad < 1) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debe seleccionar un mueble, un material y especificar una cantidad válida.",
      });
      return;
    }

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
      const res = await fetch(
        `http://localhost:8080/api/mueble-material/${formData.id_mue_mat}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            id_mue: formData.id_mue,
            id_mat: formData.id_mat,
            cantidad: formData.cantidad,
          }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar mueble-material");

      // Refrescar datos
      const updatedRes = await fetch(
        "http://localhost:8080/api/mueble-material"
      );
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setMueblesMateriales(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El registro fue actualizado exitosamente.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setShowModal(false);
    } catch (err) {
      console.error("Error al actualizar mueble-material:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el registro. Intente nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !mueblematerialSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="w-7 h-7" />
            Editar Asignación de Material
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel Mueble */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Seleccionar Mueble
              </h3>
              <SearchInput
                value={searchMueble}
                onChange={setSearchMueble}
                placeholder="Buscar mueble..."
              />

              {mueblesLoading ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {muebles.length > 0 ? (
                      muebles.map((mueble) => (
                        <MuebleSelectCard
                          key={mueble.id_mue}
                          mueble={mueble}
                          isSelected={formData.id_mue === mueble.id_mue}
                          onSelect={() =>
                            setFormData({ ...formData, id_mue: mueble.id_mue })
                          }
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
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

            {/* Panel Material */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-green-600" />
                Seleccionar Material
              </h3>
              <SearchInput
                value={searchMaterial}
                onChange={setSearchMaterial}
                placeholder="Buscar material..."
              />

              {materialesLoading ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {materiales.length > 0 ? (
                      materiales.map((material) => (
                        <MaterialSelectCard
                          key={material.id_mat}
                          material={material}
                          isSelected={formData.id_mat === material.id_mat}
                          onSelect={() =>
                            setFormData({
                              ...formData,
                              id_mat: material.id_mat,
                            })
                          }
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

            {/* Panel Cantidad (ocupa todo el ancho) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-600" />
                Cantidad
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Cantidad de material a asignar:
                    </p>
                    <input
                      type="number"
                      min="1"
                      value={formData.cantidad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cantidad: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-32 text-center py-2 px-4 text-lg font-semibold rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {selectedMaterial && (
                      <span className="ml-3 text-gray-500 dark:text-gray-400">
                        {selectedMaterial.unidad_medida}
                      </span>
                    )}
                  </div>
                  {/* Resumen de selección */}
                  {selectedMueble && selectedMaterial && (
                    <div className="flex-1 text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Resumen:
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {formData.cantidad} {selectedMaterial.unidad_medida} de{" "}
                        <span className="text-green-600 dark:text-green-400">
                          {selectedMaterial.nom_mat}
                        </span>{" "}
                        para{" "}
                        <span className="text-blue-600 dark:text-blue-400">
                          {selectedMueble.nom_mue}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.id_mue || !formData.id_mat}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors shadow-lg shadow-amber-500/30"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
