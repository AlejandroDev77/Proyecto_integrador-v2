import { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  Armchair,
  FolderTree,
  Settings,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  DollarSign,
  Boxes,
  Ruler,
  FileText,
  CheckCircle,
  Image,
  Box,
  UploadCloud,
} from "lucide-react";

export interface Mueble {
  id_mue: number;
  nom_mue: string;
  desc_mue: string;
  precio_venta: number;
  precio_costo: number;
  stock: number;
  stock_min: number;
  dimensiones: string;
  est_mue: boolean;
  img_mue?: string;
  modelo_3d?: string;
  id_cat: number;
  categoria?: { nom_cat: string } | null;
}
interface Categoria {
  id_cat: number;
  nom_cat: string;
  cod_cat?: string;
  desc_cat?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setMuebles: React.Dispatch<React.SetStateAction<Mueble[]>>;
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
                  ? "bg-indigo-600 text-white shadow-lg"
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
                index + 1 === currentStep ? "text-indigo-600" : "text-gray-500"
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 text-sm"
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

function CategoriaCard({
  categoria,
  isSelected,
  onSelect,
}: {
  categoria: Categoria;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <FolderTree className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{categoria.cod_cat}</p>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {categoria.nom_cat}
          </h4>
          {categoria.desc_cat && (
            <p className="text-sm text-gray-500 truncate">
              {categoria.desc_cat}
            </p>
          )}
        </div>
        {isSelected && <Check className="w-6 h-6 text-indigo-500" />}
      </div>
    </div>
  );
}

export default function ModalAgregarMueble({
  showModal,
  setShowModal,
  setMuebles,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    nom_mue: "",
    desc_mue: "",
    precio_venta: 0,
    precio_costo: 0,
    stock: 0,
    stock_min: 0,
    dimensiones: "",
    est_mue: true,
  });
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [catSearch, setCatSearch] = useState("");
  const [catPag, setCatPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingCat, setLoadingCat] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Archivos
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [modelo3dFile, setModelo3dFile] = useState<File | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const modelo3dInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { label: "Categoría", icon: <FolderTree className="w-4 h-4" /> },
    { label: "Datos", icon: <Settings className="w-4 h-4" /> },
    { label: "Archivos", icon: <UploadCloud className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchCategorias = useCallback(async (page = 1, search = "") => {
    setLoadingCat(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/categoria-mueble?page=${page}&per_page=6${
          search ? `&filter[nom_cat]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setCategorias(p?.data || []);
      setCatPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setCategorias([]);
    } finally {
      setLoadingCat(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) fetchCategorias();
  }, [showModal, fetchCategorias]);
  useEffect(() => {
    const t = setTimeout(() => fetchCategorias(1, catSearch), 300);
    return () => clearTimeout(t);
  }, [catSearch, fetchCategorias]);

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
    setSelectedCategoria(null);
    setForm({
      nom_mue: "",
      desc_mue: "",
      precio_venta: 0,
      precio_costo: 0,
      stock: 0,
      stock_min: 0,
      dimensiones: "",
      est_mue: true,
    });
    setImgFile(null);
    setModelo3dFile(null);
    setValidationErrors(null);
    setGeneralError(null);
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedCategoria;
      case 2:
        return form.nom_mue.trim().length > 0;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategoria || !form.nom_mue) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);

    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) uid = (jwtDecode(token) as any).id_usu;
    } catch {}

    try {
      const formData = new FormData();
      formData.append("nom_mue", form.nom_mue);
      formData.append("desc_mue", form.desc_mue);
      formData.append("precio_venta", String(form.precio_venta));
      formData.append("precio_costo", String(form.precio_costo));
      formData.append("stock", String(form.stock));
      formData.append("stock_min", String(form.stock_min));
      formData.append("dimensiones", form.dimensiones);
      formData.append("est_mue", form.est_mue ? "1" : "0");
      formData.append("id_cat", String(selectedCategoria.id_cat));
      if (imgFile) formData.append("img_mue", imgFile);
      if (modelo3dFile) formData.append("modelo_3d", modelo3dFile);

      const res = await fetch("http://localhost:8000/api/mueble", {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(uid ? { "X-USER-ID": uid } : {}),
        },
        body: formData,
      });

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
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      setMuebles((prev) => [
        ...prev,
        { ...responseData, categoria: { nom_cat: selectedCategoria.nom_cat } },
      ]);
      Swal.fire({
        icon: "success",
        title: "¡Mueble creado!",
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

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Armchair className="w-6 h-6" />
            Nuevo Mueble
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
                <FolderTree className="w-5 h-5 text-indigo-600" />
                Seleccionar Categoría
              </h3>
              <SearchInput
                value={catSearch}
                onChange={setCatSearch}
                placeholder="Buscar categoría..."
              />
              {loadingCat ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {categorias.length > 0 ? (
                      categorias.map((c) => (
                        <CategoriaCard
                          key={c.id_cat}
                          categoria={c}
                          isSelected={selectedCategoria?.id_cat === c.id_cat}
                          onSelect={() => setSelectedCategoria(c)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron categorías</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={catPag}
                    onPageChange={(p) => fetchCategorias(p, catSearch)}
                    isLoading={loadingCat}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
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
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Datos del Mueble
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Armchair className="w-4 h-4 text-indigo-500" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={form.nom_mue}
                    onChange={(e) =>
                      setForm({ ...form, nom_mue: e.target.value })
                    }
                    placeholder="Ej: Mesa de Centro"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                    Estado
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, est_mue: true })}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium ${
                        form.est_mue
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      Activo
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, est_mue: false })}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium ${
                        !form.est_mue
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      Inactivo
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    Descripción
                  </label>
                  <textarea
                    value={form.desc_mue}
                    onChange={(e) =>
                      setForm({ ...form, desc_mue: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                    Precio Venta (Bs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.precio_venta}
                    onChange={(e) =>
                      setForm({ ...form, precio_venta: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                    Precio Costo (Bs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.precio_costo}
                    onChange={(e) =>
                      setForm({ ...form, precio_costo: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Ruler className="w-4 h-4 text-indigo-500" />
                    Dimensiones
                  </label>
                  <input
                    type="text"
                    value={form.dimensiones}
                    onChange={(e) =>
                      setForm({ ...form, dimensiones: e.target.value })
                    }
                    placeholder="Ej: 120x60x45 cm"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Boxes className="w-4 h-4 text-indigo-500" />
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Boxes className="w-4 h-4 text-indigo-500" />
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    value={form.stock_min}
                    onChange={(e) =>
                      setForm({ ...form, stock_min: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600" />
                Archivos del Mueble
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen del Mueble
                  </label>
                  <div
                    onClick={() => imgInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      imgFile
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
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
                    onClick={() => modelo3dInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      modelo3dFile
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    }`}
                  >
                    {modelo3dFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <Box className="w-12 h-12 text-green-500" />
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          {modelo3dFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(modelo3dFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModelo3dFile(null);
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
                      ref={modelo3dInputRef}
                      type="file"
                      accept=".glb,.obj,.gltf"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        setModelo3dFile(e.target.files[0])
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
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Mueble
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderTree className="w-6 h-6 text-indigo-600" />
                    <span className="font-semibold">Categoría</span>
                  </div>
                  <p className="text-lg font-bold text-indigo-600">
                    {selectedCategoria?.nom_cat}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle
                      className={`w-6 h-6 ${
                        form.est_mue ? "text-green-600" : "text-red-600"
                      }`}
                    />
                    <span className="font-semibold">Estado</span>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      form.est_mue ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {form.est_mue ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="mb-3">
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="font-bold text-lg">{form.nom_mue}</p>
                </div>
                {form.desc_mue && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Descripción</p>
                    <p className="text-sm">{form.desc_mue}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Precio Venta</p>
                    <p className="font-bold text-green-600">
                      {form.precio_venta} Bs.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio Costo</p>
                    <p className="font-bold">{form.precio_costo} Bs.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className="font-bold">{form.stock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock Mín.</p>
                    <p className="font-bold">{form.stock_min}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-600" />
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
                        modelo3dFile
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                      }`}
                    >
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Modelo 3D</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {modelo3dFile ? modelo3dFile.name : "No seleccionado"}
                      </p>
                    </div>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {isSubmitting ? "Guardando..." : "Crear Mueble"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
