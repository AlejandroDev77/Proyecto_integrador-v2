import React, { useEffect, useState, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Palette,
  X,
  Save,
  AlertCircle,
  FileText,
  ClipboardList,
  Image,
  Box,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UploadCloud,
  RefreshCw,
} from "lucide-react";

// Interfaces
interface Diseño {
  id_dis: number;
  cod_dis?: string;
  nom_dis: string;
  desc_dis: string;
  archivo_3d: string;
  img_dis: string;
  id_cot: number;
  cotizacion?: { fec_cot: string; est_cot: string };
}
interface Cotizacion {
  id_cot: number;
  fec_cot: string;
  est_cot: string;
  cod_cot?: string;
  total_cot?: number;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  diseñoSeleccionado: Diseño | null;
  setDiseños: React.Dispatch<React.SetStateAction<Diseño[]>>;
}
interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 text-sm"
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
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-purple-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {cotizacion.cod_cot}
          </p>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {cotizacion.fec_cot}
          </h4>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              cotizacion.est_cot === "Aprobado"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {cotizacion.est_cot}
          </span>
        </div>
        {isSelected && <Check className="w-5 h-5 text-purple-500 shrink-0" />}
      </div>
    </div>
  );
}

const ModalEditarDiseño: React.FC<Props> = ({
  showModal,
  setShowModal,
  diseñoSeleccionado,
  setDiseños,
}) => {
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cotSearch, setCotSearch] = useState("");
  const [cotPagination, setCotPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingCot, setLoadingCot] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "form" | "cotizacion" | "archivos"
  >("form");

  // File states
  const [archivo3dFile, setArchivo3dFile] = useState<File | null>(null);
  const [imgDisFile, setImgDisFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [currentImgUrl, setCurrentImgUrl] = useState<string>("");
  const [current3dUrl, setCurrent3dUrl] = useState<string>("");
  const archivo3dInputRef = useRef<HTMLInputElement>(null);
  const imgDisInputRef = useRef<HTMLInputElement>(null);

  const fetchCotizaciones = useCallback(async (page = 1, search = "") => {
    setLoadingCot(true);
    try {
      const url = `http://localhost:8080/api/cotizacion?page=${page}&per_page=6${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`;
      const res = await fetch(url);
      const payload = await res.json();
      if (payload?.data) {
        setCotizaciones(payload.data);
        setCotPagination({
          currentPage: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          total: payload.total || 0,
        });
      } else {
        setCotizaciones(Array.isArray(payload) ? payload : []);
      }
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
    if (diseñoSeleccionado) {
      setForm({
        nombre: diseñoSeleccionado.nom_dis || "",
        descripcion: diseñoSeleccionado.desc_dis || "",
      });
      setCurrentImgUrl(diseñoSeleccionado.img_dis || "");
      setCurrent3dUrl(diseñoSeleccionado.archivo_3d || "");
      setArchivo3dFile(null);
      setImgDisFile(null);
      if (diseñoSeleccionado.id_cot) {
        fetch(
          `http://localhost:8080/api/cotizacion/${diseñoSeleccionado.id_cot}`
        )
          .then((r) => r.json())
          .then((c) => setSelectedCotizacion(c?.data ?? c))
          .catch(() => {});
      }
    }
  }, [diseñoSeleccionado]);

  useEffect(() => {
    if (imgDisFile) {
      const url = URL.createObjectURL(imgDisFile);
      setImgPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImgPreview(null);
    }
  }, [imgDisFile]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "imagen" | "modelo3d"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "imagen") {
        setImgDisFile(file);
      } else {
        setArchivo3dFile(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!diseñoSeleccionado) return;
    if (!form.nombre) {
      setErrorMsg("El nombre es requerido.");
      return;
    }
    if (!selectedCotizacion) {
      setErrorMsg("Seleccione una cotización.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("nom_dis", form.nombre);
      formData.append("desc_dis", form.descripcion);
      formData.append("id_cot", selectedCotizacion.id_cot.toString());
      formData.append("_method", "PUT");
      if (imgDisFile) {
        formData.append("img_dis", imgDisFile);
      }
      if (archivo3dFile) {
        formData.append("archivo_3d", archivo3dFile);
      }

      let idUsuarioLocal = null;
      try {
        const userObj = JSON.parse(localStorage.getItem("user") || "null");
        idUsuarioLocal = userObj?.id_usu || null;
      } catch {
        idUsuarioLocal = null;
      }
      const headers: Record<string, string> = {};
      if (idUsuarioLocal) {
        headers["X-USER-ID"] = idUsuarioLocal;
      }

      const res = await fetch(
        `http://localhost:8080/api/diseño/${diseñoSeleccionado.id_dis}`,
        { method: "POST", headers, body: formData }
      );

      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(
          err.errors
            ? Object.values(err.errors).flat().join(" ")
            : err.error || "Error"
        );
        return;
      }
      const payload: any = await res.json();
      const data = payload?.data ?? payload;
      setDiseños((prev) =>
        prev.map((d) => (d.id_dis === data.id_dis ? data : d))
      );
      Swal.fire({
        icon: "success",
        title: "¡Diseño actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowModal(false);
    } catch (err) {
      setErrorMsg("Error al editar");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || !diseñoSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Palette className="w-6 h-6" />
            Editar Diseño
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-lg">
              {diseñoSeleccionado.cod_dis}
            </span>
            <button
              onClick={() => setShowModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            {
              key: "form",
              label: "Datos",
              icon: <FileText className="w-4 h-4" />,
            },
            {
              key: "cotizacion",
              label: "Cotización",
              icon: <ClipboardList className="w-4 h-4" />,
              selected: selectedCotizacion,
            },
            {
              key: "archivos",
              label: "Archivos",
              icon: <Image className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as typeof activeSection)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                activeSection === tab.key
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {(tab as any).selected && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{errorMsg}</span>
            </div>
          )}

          {activeSection === "form" && (
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Cotización
                </h4>
                <div
                  className={`p-3 rounded-lg border-2 ${
                    selectedCotizacion
                      ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedCotizacion
                      ? `${selectedCotizacion.cod_cot} - ${selectedCotizacion.fec_cot}`
                      : "No seleccionado"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "cotizacion" && (
            <div>
              <SearchInput
                value={cotSearch}
                onChange={setCotSearch}
                placeholder="Buscar cotización..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {loadingCot ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    Cargando...
                  </div>
                ) : (
                  cotizaciones.map((c) => (
                    <CotizacionCard
                      key={c.id_cot}
                      cotizacion={c}
                      isSelected={selectedCotizacion?.id_cot === c.id_cot}
                      onSelect={() => setSelectedCotizacion(c)}
                    />
                  ))
                )}
              </div>
              <MiniPagination
                pagination={cotPagination}
                onPageChange={(p) => fetchCotizaciones(p, cotSearch)}
                isLoading={loadingCot}
              />
            </div>
          )}

          {activeSection === "archivos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imagen */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Image className="w-4 h-4 text-purple-500" />
                  Imagen del Diseño
                </label>
                {currentImgUrl && !imgDisFile && (
                  <div className="mb-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentImgUrl}
                        alt="Imagen"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Imagen actual
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => imgDisInputRef.current?.click()}
                      className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Cambiar
                    </button>
                  </div>
                )}
                <div
                  onClick={() => imgDisInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    imgDisFile
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
                  }`}
                >
                  {imgPreview ? (
                    <div className="relative">
                      <img
                        src={imgPreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImgDisFile(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {imgDisFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Image className="w-10 h-10 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentImgUrl
                          ? "Subir nueva imagen"
                          : "Clic para subir"}
                      </p>
                    </div>
                  )}
                  <input
                    ref={imgDisInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "imagen")}
                    className="hidden"
                  />
                </div>
              </div>
              {/* Modelo 3D */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Box className="w-4 h-4 text-purple-500" />
                  Modelo 3D
                </label>
                {current3dUrl && !archivo3dFile && (
                  <div className="mb-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Box className="w-10 h-10 text-indigo-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Modelo actual
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => archivo3dInputRef.current?.click()}
                      className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Cambiar
                    </button>
                  </div>
                )}
                <div
                  onClick={() => archivo3dInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    archivo3dFile
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
                  }`}
                >
                  {archivo3dFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <Box className="w-10 h-10 text-green-500" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          {archivo3dFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(archivo3dFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setArchivo3dFile(null);
                        }}
                        className="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="w-10 h-10 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {current3dUrl
                          ? "Subir nuevo modelo"
                          : "Clic para subir"}
                      </p>
                    </div>
                  )}
                  <input
                    ref={archivo3dInputRef}
                    type="file"
                    accept=".glb,.obj,.gltf"
                    onChange={(e) => handleFileChange(e, "modelo3d")}
                    className="hidden"
                  />
                </div>
              </div>
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
            disabled={isSubmitting || !selectedCotizacion}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/30"
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

export default ModalEditarDiseño;
