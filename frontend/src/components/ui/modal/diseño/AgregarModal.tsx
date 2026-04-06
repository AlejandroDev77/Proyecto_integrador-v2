import { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Palette,
  FileText,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  Image,
  Box,
  UploadCloud,
  ClipboardCheck,
} from "lucide-react";

interface Diseño {
  id_dis: number;
  cod_dis?: string;
  nom_dis: string;
  desc_dis: string;
  archivo_3d: string;
  img_dis: string;
  id_cot: number;
  cotizacion?: {
    fec_cot: string;
    est_cot: string;
  };
}

interface Cotizacion {
  id_cot: number;
  cod_cot?: string;
  fec_cot: string;
  est_cot: string;
  total_cot: number;
  cliente?: { nom_cli: string; ap_pat_cli: string };
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setDiseños: React.Dispatch<React.SetStateAction<Diseño[]>>;
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
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
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
                  ? "text-pink-600 dark:text-pink-400"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
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

// Card de Cotizacion
function CotizacionCard({
  cotizacion,
  isSelected,
  onSelect,
}: {
  cotizacion: Cotizacion;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const getEstadoColor = (est: string) => {
    switch (est) {
      case "Aprobado":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Rechazado":
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
          ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pink-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isSelected
              ? "bg-pink-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {cotizacion.cod_cot}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {cotizacion.fec_cot}
          </h4>
          {cotizacion.cliente && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cotizacion.cliente.nom_cli} {cotizacion.cliente.ap_pat_cli}
            </p>
          )}
          <div className="flex gap-2 mt-1 items-center">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${getEstadoColor(
                cotizacion.est_cot
              )}`}
            >
              {cotizacion.est_cot}
            </span>
            <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
              {cotizacion.total_cot} Bs.
            </span>
          </div>
        </div>
        {isSelected && <Check className="w-6 h-6 text-pink-500 shrink-0" />}
      </div>
    </div>
  );
}

export default function ModalAgregarDiseño({
  showModal,
  setShowModal,
  setDiseños,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({ nom_dis: "", desc_dis: "" });
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);

  // Files
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [archivo3dFile, setArchivo3dFile] = useState<File | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const archivo3dInputRef = useRef<HTMLInputElement>(null);

  // Cotizaciones
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cotizacionesPagination, setCotizacionesPagination] =
    useState<PaginationInfo>({ currentPage: 1, lastPage: 1, total: 0 });
  const [cotizacionesLoading, setCotizacionesLoading] = useState(false);
  const [searchCotizacion, setSearchCotizacion] = useState("");

  const steps = [
    { label: "Cotización", icon: <FileText className="w-4 h-4" /> },
    { label: "Información", icon: <Palette className="w-4 h-4" /> },
    { label: "Archivos", icon: <UploadCloud className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchCotizaciones = useCallback(
    async (page: number, search: string = "") => {
      setCotizacionesLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "6",
        });
        if (search) params.append("filter[cod_cot]", search);
        const res = await fetch(
          `http://localhost:8080/api/cotizacion?${params}`
        );
        const payload = await res.json();
        const items = payload?.data ?? payload;
        setCotizaciones(Array.isArray(items) ? items : []);
        if (payload?.meta || payload?.last_page) {
          setCotizacionesPagination({
            currentPage:
              payload?.meta?.current_page ?? payload?.current_page ?? page,
            lastPage: payload?.meta?.last_page ?? payload?.last_page ?? 1,
            total: payload?.meta?.total ?? payload?.total ?? items.length,
          });
        }
      } catch {
        setCotizaciones([]);
      } finally {
        setCotizacionesLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (showModal) {
      fetchCotizaciones(1, "");
    }
  }, [showModal, fetchCotizaciones]);
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => fetchCotizaciones(1, searchCotizacion), 300);
    return () => clearTimeout(timer);
  }, [searchCotizacion, showModal, fetchCotizaciones]);

  // Preview de imagen
  useEffect(() => {
    if (imgFile) {
      const url = URL.createObjectURL(imgFile);
      setImgPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImgPreview(null);
    }
  }, [imgFile]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedCotizacion(null);
    setForm({ nom_dis: "", desc_dis: "" });
    setImgFile(null);
    setArchivo3dFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedCotizacion || !form.nom_dis) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("nom_dis", form.nom_dis);
      formData.append("desc_dis", form.desc_dis);
      formData.append("id_cot", selectedCotizacion.id_cot.toString());
      if (imgFile) formData.append("img_dis", imgFile);
      if (archivo3dFile) formData.append("archivo_3d", archivo3dFile);

      let idUsuarioLocal = null;
      try {
        const userObj = JSON.parse(localStorage.getItem("user") || "null");
        idUsuarioLocal = userObj?.id_usu || null;
      } catch {
        idUsuarioLocal = null;
      }
      const headers: Record<string, string> = {};
      if (idUsuarioLocal) headers["X-USER-ID"] = idUsuarioLocal;

      const res = await fetch("http://localhost:8080/api/diseño", {
        method: "POST",
        headers,
        body: formData,
      });
      if (!res.ok) throw new Error("Error al crear diseño");

      const updatedRes = await fetch("http://localhost:8080/api/diseño");
      const updatedPayload: any = await updatedRes.json();
      const updatedItems = updatedPayload?.data ?? updatedPayload;
      setDiseños(Array.isArray(updatedItems) ? updatedItems : []);

      Swal.fire({
        icon: "success",
        title: "¡Diseño creado!",
        text: "El diseño se ha guardado exitosamente.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      handleClose();
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el diseño.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedCotizacion;
      case 2:
        return !!form.nom_dis;
      case 3:
        return true;
      default:
        return true;
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Palette className="w-6 h-6" />
            Nuevo Diseño
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
                <FileText className="w-5 h-5 text-pink-600" />
                Seleccionar Cotización
              </h3>
              <SearchInput
                value={searchCotizacion}
                onChange={setSearchCotizacion}
                placeholder="Buscar por código..."
              />
              {cotizacionesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
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
                    pagination={cotizacionesPagination}
                    onPageChange={(p) => fetchCotizaciones(p, searchCotizacion)}
                    isLoading={cotizacionesLoading}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-600" />
                Información del Diseño
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre del Diseño *
                  </label>
                  <input
                    type="text"
                    value={form.nom_dis}
                    onChange={(e) =>
                      setForm({ ...form, nom_dis: e.target.value })
                    }
                    placeholder="Ej: Diseño moderno sala"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={form.desc_dis}
                    onChange={(e) =>
                      setForm({ ...form, desc_dis: e.target.value })
                    }
                    rows={4}
                    placeholder="Describe el diseño..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-pink-600" />
                Archivos del Diseño
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen del Diseño
                  </label>
                  <div
                    onClick={() => imgInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      imgFile
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                    }`}
                  >
                    {imgPreview ? (
                      <div className="relative">
                        <img
                          src={imgPreview}
                          alt="Preview"
                          className="max-h-40 mx-auto rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImgFile(null);
                          }}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" />
                          {imgFile?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Image className="w-12 h-12 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Haz clic para subir
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG, GIF (máx. 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      ref={imgInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] && setImgFile(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Modelo 3D */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modelo 3D
                  </label>
                  <div
                    onClick={() => archivo3dInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      archivo3dFile
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                    }`}
                  >
                    {archivo3dFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <Box className="w-12 h-12 text-green-500" />
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          {archivo3dFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(archivo3dFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setArchivo3dFile(null);
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Box className="w-12 h-12 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Haz clic para subir
                        </p>
                        <p className="text-xs text-gray-400">
                          GLB, OBJ, GLTF (máx. 50MB)
                        </p>
                      </div>
                    )}
                    <input
                      ref={archivo3dInputRef}
                      type="file"
                      accept=".glb,.obj,.gltf"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        setArchivo3dFile(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Resumen del Diseño
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded-xl border border-pink-200 dark:border-pink-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pink-600" />
                    Cotización
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 font-mono text-lg">
                    {selectedCotizacion?.cod_cot}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedCotizacion?.fec_cot}
                  </p>
                  <span className="inline-block mt-2 text-sm font-semibold text-pink-600">
                    {selectedCotizacion?.total_cot} Bs.
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-pink-600" />
                    Diseño
                  </h4>
                  <p className="text-gray-900 dark:text-white font-medium text-lg">
                    {form.nom_dis}
                  </p>
                  {form.desc_dis && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {form.desc_dis}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-pink-600" />
                  Archivos
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        imgFile
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                      }`}
                    >
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Imagen</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {imgFile ? imgFile.name : "No seleccionada"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        archivo3dFile
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                      }`}
                    >
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Modelo 3D</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {archivo3dFile ? archivo3dFile.name : "No seleccionado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-pink-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Crear Diseño
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
