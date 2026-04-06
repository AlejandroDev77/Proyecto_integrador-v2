import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  Upload,
  ClipboardCheck,
  Layers,
  User,
  Image,
  Video,
  FileText,
  Box,
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

interface ModalAgregarEvidenciaProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setEvidenciasProduccion: React.Dispatch<
    React.SetStateAction<EvidenciaProduccion[]>
  >;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
}

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
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
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
                index + 1 === currentStep ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-1 mx-1 rounded ${
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 text-sm"
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
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-green-500 text-white"
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
        {isSelected && <Check className="w-6 h-6 text-green-500" />}
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
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-green-500 text-white"
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
        {isSelected && <Check className="w-6 h-6 text-green-500" />}
      </div>
    </div>
  );
}

const ModalAgregarEvidencia: React.FC<ModalAgregarEvidenciaProps> = ({
  showModal,
  setShowModal,
  setEvidenciasProduccion,
}) => {
  const [step, setStep] = useState(1);
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo_evi: "foto",
    descripcion: "",
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoPreview, setArchivoPreview] = useState<string | null>(null);
  const archivoInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { label: "Etapa", icon: <Layers className="w-4 h-4" /> },
    { label: "Empleado", icon: <User className="w-4 h-4" /> },
    { label: "Datos", icon: <Upload className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchEtapas = useCallback(async (page = 1, search = "") => {
    setLoadingEtapa(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/produccion-etapa?page=${page}&per_page=6${
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
        `http://localhost:8080/api/empleados?page=${page}&per_page=6${
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
    setStep(1);
    setSelectedEtapa(null);
    setSelectedEmpleado(null);
    setFormData({ tipo_evi: "foto", descripcion: "" });
    setArchivo(null);
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedEtapa;
      case 2:
        return !!selectedEmpleado;
      case 3:
        return !!archivo;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedEtapa || !selectedEmpleado || !archivo) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("id_pro_eta", String(selectedEtapa.id_pro_eta));
      fd.append("tipo_evi", formData.tipo_evi);
      fd.append("descripcion", formData.descripcion);
      fd.append("id_emp", String(selectedEmpleado.id_emp));
      fd.append("archivo", archivo);

      const res = await fetch(
        "http://localhost:8080/api/evidencia-produccion",
        { method: "POST", body: fd }
      );
      if (!res.ok) throw new Error("Error al crear");

      const newEvidencia = await res.json();
      setEvidenciasProduccion((prev) => [
        ...prev,
        {
          ...newEvidencia,
          produccion_etapa: selectedEtapa,
          empleado: selectedEmpleado,
        },
      ]);

      Swal.fire({
        icon: "success",
        title: "¡Evidencia creada!",
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

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Plus className="w-6 h-6" />
            Nueva Evidencia de Producción
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-green-600" />
                Seleccionar Etapa de Producción
              </h3>
              <SearchInput
                value={etapaSearch}
                onChange={setEtapaSearch}
                placeholder="Buscar etapa..."
              />
              {loadingEtapa ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
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

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Seleccionar Empleado
              </h3>
              <SearchInput
                value={empSearch}
                onChange={setEmpSearch}
                placeholder="Buscar empleado..."
              />
              {loadingEmp ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
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

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                Datos de la Evidencia
              </h3>

              {/* Tipo de evidencia con botones visuales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tipo de Evidencia *
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
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-green-300"
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
                  Archivo *
                </label>
                <div
                  onClick={() => archivoInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    archivo
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
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
                          {archivo.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        {formData.tipo_evi === "video" ? (
                          <Video className="w-12 h-12 text-green-500" />
                        ) : formData.tipo_evi === "documento" ? (
                          <FileText className="w-12 h-12 text-green-500" />
                        ) : (
                          <Box className="w-12 h-12 text-green-500" />
                        )}
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          {archivo.name}
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Descripción opcional..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Evidencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-6 h-6 text-green-600" />
                    <span className="font-semibold">Etapa seleccionada</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Producción #{selectedEtapa?.id_pro}
                  </p>
                  <p className="font-bold text-green-600">
                    {selectedEtapa?.etapa?.nom_eta ||
                      `Etapa ${selectedEtapa?.id_pro_eta}`}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-6 h-6 text-green-600" />
                    <span className="font-semibold">Empleado</span>
                  </div>
                  <p className="font-bold text-green-600">
                    {selectedEmpleado?.nom_emp}{" "}
                    {selectedEmpleado?.ape_emp || ""}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Tipo</p>
                    <p className="font-medium capitalize">
                      {formData.tipo_evi}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Archivo</p>
                    <p className="font-medium truncate">{archivo?.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Descripción</p>
                    <p className="font-medium">
                      {formData.descripcion || "Sin descripción"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {loading ? "Subiendo..." : "Crear Evidencia"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarEvidencia;
