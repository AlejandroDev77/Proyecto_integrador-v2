import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Upload,
  Settings,
  Layers,
  User,
  Image,
  Video,
  FileText,
  UploadCloud,
} from "lucide-react";
import Swal from "sweetalert2";

interface ProduccionEtapa {
  id_pro_eta: number;
  id_pro: number;
  etapa?: { nom_eta: string };
}

interface Empleado {
  id_emp: number;
  nom_emp: string;
  ape_emp?: string;
}

interface EvidenciaProduccion {
  id_evi: number;
  cod_evi?: string;
  id_pro_eta: number;
  tipo_evi: string;
  archivo_evi?: string;
  descripcion?: string;
  fec_evi?: string;
  id_emp: number;
  produccion_etapa?: {
    id_pro_eta: number;
    id_pro: number;
    etapa?: { nom_eta: string };
  };
  empleado?: { nom_emp: string; ape_emp?: string };
}

interface ModalEditarEvidenciaProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  evidenciaSeleccionado: EvidenciaProduccion | null;
  setEvidenciasProduccion: React.Dispatch<
    React.SetStateAction<EvidenciaProduccion[]>
  >;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

type TabType = "datos" | "etapa" | "empleado";

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

function EtapaCard({
  etapa,
  isSelected,
  onSelect,
}: {
  etapa: ProduccionEtapa;
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
          <Layers className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">
            Producción #{etapa.id_pro}
          </p>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {etapa.etapa?.nom_eta || `Etapa ${etapa.id_pro_eta}`}
          </h4>
        </div>
        {isSelected && <Check className="w-6 h-6 text-amber-500" />}
      </div>
    </div>
  );
}

function EmpleadoCard({
  empleado,
  isSelected,
  onSelect,
}: {
  empleado: Empleado;
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
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {empleado.nom_emp} {empleado.ape_emp || ""}
          </h4>
        </div>
        {isSelected && <Check className="w-6 h-6 text-amber-500" />}
      </div>
    </div>
  );
}

const ModalEditarEvidencia: React.FC<ModalEditarEvidenciaProps> = ({
  showModal,
  setShowModal,
  evidenciaSeleccionado,
  setEvidenciasProduccion,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("datos");
  const [loading, setLoading] = useState(false);
  const [produccionEtapas, setProduccionEtapas] = useState<ProduccionEtapa[]>(
    []
  );
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedEtapa, setSelectedEtapa] = useState<ProduccionEtapa | null>(
    null
  );
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [etapaSearch, setEtapaSearch] = useState("");
  const [empSearch, setEmpSearch] = useState("");
  const [etapaPag, setEtapaPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [empPag, setEmpPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingEtapa, setLoadingEtapa] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [formData, setFormData] = useState({
    tipo_evi: "foto",
    descripcion: "",
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoPreview, setArchivoPreview] = useState<string | null>(null);
  const archivoInputRef = useRef<HTMLInputElement>(null);

  const fetchEtapas = useCallback(async (page = 1, search = "") => {
    setLoadingEtapa(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/produccion-etapa?page=${page}&per_page=6${
          search ? `&filter[nom_eta]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setProduccionEtapas(p?.data || []);
      setEtapaPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setProduccionEtapas([]);
    } finally {
      setLoadingEtapa(false);
    }
  }, []);

  const fetchEmpleados = useCallback(async (page = 1, search = "") => {
    setLoadingEmp(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/empleados?page=${page}&per_page=6${
          search ? `&filter[nom_emp]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setEmpleados(p?.data || []);
      setEmpPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setEmpleados([]);
    } finally {
      setLoadingEmp(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchEtapas();
      fetchEmpleados();
    }
  }, [showModal, fetchEtapas, fetchEmpleados]);
  useEffect(() => {
    const t = setTimeout(() => fetchEtapas(1, etapaSearch), 300);
    return () => clearTimeout(t);
  }, [etapaSearch, fetchEtapas]);
  useEffect(() => {
    const t = setTimeout(() => fetchEmpleados(1, empSearch), 300);
    return () => clearTimeout(t);
  }, [empSearch, fetchEmpleados]);

  useEffect(() => {
    if (evidenciaSeleccionado) {
      setFormData({
        tipo_evi: evidenciaSeleccionado.tipo_evi || "foto",
        descripcion: evidenciaSeleccionado.descripcion || "",
      });
      setSelectedEtapa(
        evidenciaSeleccionado.produccion_etapa || {
          id_pro_eta: evidenciaSeleccionado.id_pro_eta,
          id_pro: 0,
        }
      );
      setSelectedEmpleado(
        evidenciaSeleccionado.empleado
          ? {
              id_emp: evidenciaSeleccionado.id_emp,
              nom_emp: evidenciaSeleccionado.empleado.nom_emp,
              ape_emp: evidenciaSeleccionado.empleado.ape_emp,
            }
          : null
      );
      setArchivo(null);
    }
  }, [evidenciaSeleccionado]);

  // Preview de imagen
  useEffect(() => {
    if (archivo && formData.tipo_evi === "foto") {
      const url = URL.createObjectURL(archivo);
      setArchivoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setArchivoPreview(null);
    }
  }, [archivo, formData.tipo_evi]);

  // Limpiar archivo cuando cambia el tipo
  useEffect(() => {
    setArchivo(null);
  }, [formData.tipo_evi]);

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("datos");
    setArchivo(null);
  };

  const handleSubmit = async () => {
    if (!evidenciaSeleccionado || !selectedEtapa || !selectedEmpleado) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("id_pro_eta", String(selectedEtapa.id_pro_eta));
      fd.append("tipo_evi", formData.tipo_evi);
      fd.append("descripcion", formData.descripcion);
      fd.append("id_emp", String(selectedEmpleado.id_emp));
      fd.append("_method", "PUT");
      if (archivo) fd.append("archivo", archivo);

      const res = await fetch(
        `http://localhost:8000/api/evidencia-produccion/${evidenciaSeleccionado.id_evi}`,
        { method: "POST", body: fd }
      );
      if (!res.ok) throw new Error("Error al actualizar");

      const updatedEvidencia = await res.json();
      setEvidenciasProduccion((prev) =>
        prev.map((e) =>
          e.id_evi === evidenciaSeleccionado.id_evi
            ? {
                ...updatedEvidencia,
                produccion_etapa: selectedEtapa,
                empleado: selectedEmpleado,
              }
            : e
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Evidencia actualizada!",
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

  const getIcon = () => {
    switch (formData.tipo_evi) {
      case "foto":
        return <Image className="w-12 h-12 text-gray-400" />;
      case "video":
        return <Video className="w-12 h-12 text-gray-400" />;
      case "documento":
        return <FileText className="w-12 h-12 text-gray-400" />;
      default:
        return <UploadCloud className="w-12 h-12 text-gray-400" />;
    }
  };

  const getAccept = () => {
    switch (formData.tipo_evi) {
      case "foto":
        return "image/*";
      case "video":
        return "video/*,.glb,.gltf";
      case "documento":
        return ".pdf,.doc,.docx,.xls,.xlsx,.txt";
      default:
        return "*";
    }
  };

  const getFileTypes = () => {
    switch (formData.tipo_evi) {
      case "foto":
        return "JPG, PNG, GIF (máx. 5MB)";
      case "video":
        return "MP4, MOV, GLB (máx. 50MB)";
      case "documento":
        return "PDF, DOC, XLS (máx. 10MB)";
      default:
        return "Cualquier archivo";
    }
  };

  if (!showModal || !evidenciaSeleccionado) return null;

  // URL del archivo existente
  const existingArchivoUrl = evidenciaSeleccionado.archivo_evi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Edit3 className="w-6 h-6" />
            Editar Evidencia -{" "}
            {evidenciaSeleccionado.cod_evi ||
              `EVI-${evidenciaSeleccionado.id_evi}`}
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
            active={activeTab === "etapa"}
            onClick={() => setActiveTab("etapa")}
            icon={Layers}
            label="Etapa"
          />
          <TabButton
            active={activeTab === "empleado"}
            onClick={() => setActiveTab("empleado")}
            icon={User}
            label="Empleado"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "datos" && (
            <div className="space-y-6">
              {/* Tipo de evidencia con botones visuales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tipo de Evidencia
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "foto",
                      label: "Foto",
                      icon: <Image className="w-6 h-6" />,
                    },
                    {
                      value: "video",
                      label: "Video / 3D",
                      icon: <Video className="w-6 h-6" />,
                    },
                    {
                      value: "documento",
                      label: "Documento",
                      icon: <FileText className="w-6 h-6" />,
                    },
                  ].map((tipo) => (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, tipo_evi: tipo.value })
                      }
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        formData.tipo_evi === tipo.value
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-amber-300"
                      }`}
                    >
                      {tipo.icon}
                      <span className="text-sm font-medium">{tipo.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone para archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Archivo (opcional - deja vacío para mantener el actual)
                </label>
                <div
                  onClick={() => archivoInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    archivo
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                  }`}
                >
                  {archivo ? (
                    formData.tipo_evi === "foto" && archivoPreview ? (
                      <div className="relative">
                        <img
                          src={archivoPreview}
                          alt="Preview"
                          className="max-h-40 mx-auto rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setArchivo(null);
                          }}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" />
                          Nuevo: {archivo.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        {formData.tipo_evi === "video" ? (
                          <Video className="w-12 h-12 text-green-500" />
                        ) : formData.tipo_evi === "documento" ? (
                          <FileText className="w-12 h-12 text-green-500" />
                        ) : (
                          <Upload className="w-12 h-12 text-green-500" />
                        )}
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Nuevo: {archivo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(archivo.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setArchivo(null);
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    )
                  ) : existingArchivoUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      {formData.tipo_evi === "foto" &&
                      existingArchivoUrl.startsWith("http") ? (
                        <img
                          src={existingArchivoUrl}
                          alt="Actual"
                          className="max-h-32 mx-auto rounded-lg shadow-md"
                        />
                      ) : (
                        getIcon()
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Archivo actual: {existingArchivoUrl.split("/").pop()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Haz clic para reemplazar
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      {getIcon()}
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Haz clic para subir
                      </p>
                      <p className="text-xs text-gray-400">{getFileTypes()}</p>
                    </div>
                  )}
                  <input
                    ref={archivoInputRef}
                    type="file"
                    accept={getAccept()}
                    onChange={(e) =>
                      e.target.files?.[0] && setArchivo(e.target.files[0])
                    }
                    className="hidden"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  placeholder="Descripción opcional..."
                />
              </div>

              {/* Resumen actual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium">Etapa actual</span>
                  </div>
                  <p className="font-bold text-amber-600">
                    {selectedEtapa?.etapa?.nom_eta ||
                      `Etapa ${selectedEtapa?.id_pro_eta}`}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium">Empleado actual</span>
                  </div>
                  <p className="font-bold text-amber-600">
                    {selectedEmpleado?.nom_emp}{" "}
                    {selectedEmpleado?.ape_emp || ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "etapa" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Cambiar Etapa
              </h3>
              <SearchInput
                value={etapaSearch}
                onChange={setEtapaSearch}
                placeholder="Buscar etapa..."
              />
              {loadingEtapa ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {produccionEtapas.length > 0 ? (
                      produccionEtapas.map((e) => (
                        <EtapaCard
                          key={e.id_pro_eta}
                          etapa={e}
                          isSelected={
                            selectedEtapa?.id_pro_eta === e.id_pro_eta
                          }
                          onSelect={() => setSelectedEtapa(e)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron etapas</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={etapaPag}
                    onPageChange={(p) => fetchEtapas(p, etapaSearch)}
                    isLoading={loadingEtapa}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "empleado" && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                Cambiar Empleado
              </h3>
              <SearchInput
                value={empSearch}
                onChange={setEmpSearch}
                placeholder="Buscar empleado..."
              />
              {loadingEmp ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {empleados.length > 0 ? (
                      empleados.map((e) => (
                        <EmpleadoCard
                          key={e.id_emp}
                          empleado={e}
                          isSelected={selectedEmpleado?.id_emp === e.id_emp}
                          onSelect={() => setSelectedEmpleado(e)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron empleados</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={empPag}
                    onPageChange={(p) => fetchEmpleados(p, empSearch)}
                    isLoading={loadingEmp}
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
            disabled={loading || !selectedEtapa || !selectedEmpleado}
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

export default ModalEditarEvidencia;
