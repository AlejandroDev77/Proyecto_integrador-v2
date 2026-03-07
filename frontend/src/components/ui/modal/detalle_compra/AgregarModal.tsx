import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { ValidationErrors, parseApiErrors } from "../shared";
import {
  Package,
  ShoppingCart,
  Boxes,
  Calculator,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  AlertCircle,
  Hash,
  DollarSign,
} from "lucide-react";

interface DetalleCompra {
  id_det_comp: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_comp: number;
  id_mat: number;
  compramaterial?: { fec_comp: string };
  material?: { nom_mat: string };
}
interface CompraMaterial {
  id_comp: number;
  fec_comp: string;
  cod_comp?: string;
  total_comp?: number;
}
interface Material {
  id_mat: number;
  nom_mat: string;
  cod_mat?: string;
  unidad_medida?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setDetallesCompra: React.Dispatch<React.SetStateAction<DetalleCompra[]>>;
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
                  ? "bg-emerald-600 text-white shadow-lg"
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
                index + 1 === currentStep ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-1 mx-1 rounded ${
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
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 text-sm"
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

function CompraCard({
  compra,
  isSelected,
  onSelect,
}: {
  compra: CompraMaterial;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{compra.cod_comp}</p>
          <h4 className="font-medium text-sm">{compra.fec_comp}</h4>
          {compra.total_comp && (
            <span className="text-xs text-green-600 font-medium">
              {compra.total_comp} Bs.
            </span>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
      </div>
    </div>
  );
}

function MaterialCard({
  material,
  isSelected,
  onSelect,
}: {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border-2 p-3 transition-all hover:shadow-md ${
        isSelected
          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-teal-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Boxes className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">{material.cod_mat}</p>
          <h4 className="font-medium text-sm truncate">{material.nom_mat}</h4>
          {material.unidad_medida && (
            <span className="text-xs text-gray-500">
              {material.unidad_medida}
            </span>
          )}
        </div>
        {isSelected && <Check className="w-5 h-5 text-teal-500" />}
      </div>
    </div>
  );
}

export default function ModalAgregarDetalleCompra({
  showModal,
  setShowModal,
  setDetallesCompra,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [form, setForm] = useState({ cantidad: 1, precio_unitario: 0 });
  const [selectedCompra, setSelectedCompra] = useState<CompraMaterial | null>(
    null
  );
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [compras, setCompras] = useState<CompraMaterial[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [compraSearch, setCompraSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const [compraPag, setCompraPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [materialPag, setMaterialPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingCompra, setLoadingCompra] = useState(false);
  const [loadingMaterial, setLoadingMaterial] = useState(false);

  const steps = [
    { label: "Compra", icon: <ShoppingCart className="w-4 h-4" /> },
    { label: "Material", icon: <Boxes className="w-4 h-4" /> },
    { label: "Detalles", icon: <Calculator className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchCompras = useCallback(async (page = 1, search = "") => {
    setLoadingCompra(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/compra-material?page=${page}&per_page=8${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setCompras(p?.data || []);
      setCompraPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setCompras([]);
    } finally {
      setLoadingCompra(false);
    }
  }, []);
  const fetchMateriales = useCallback(async (page = 1, search = "") => {
    setLoadingMaterial(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/materiales?page=${page}&per_page=8${
          search ? `&filter[nom_mat]=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setMateriales(p?.data || []);
      setMaterialPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setMateriales([]);
    } finally {
      setLoadingMaterial(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchCompras();
      fetchMateriales();
    }
  }, [showModal, fetchCompras, fetchMateriales]);
  useEffect(() => {
    const t = setTimeout(() => fetchCompras(1, compraSearch), 300);
    return () => clearTimeout(t);
  }, [compraSearch, fetchCompras]);
  useEffect(() => {
    const t = setTimeout(() => fetchMateriales(1, materialSearch), 300);
    return () => clearTimeout(t);
  }, [materialSearch, fetchMateriales]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedCompra(null);
    setSelectedMaterial(null);
    setForm({ cantidad: 1, precio_unitario: 0 });
    setValidationErrors(null);
    setGeneralError(null);
  };
  const subtotal = form.cantidad * form.precio_unitario;
  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedCompra;
      case 2:
        return !!selectedMaterial;
      case 3:
        return form.cantidad > 0 && form.precio_unitario > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedCompra || !selectedMaterial) return;
    setIsSubmitting(true);
    setValidationErrors(null);
    setGeneralError(null);
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}
    try {
      const res = await fetch("http://localhost:8000/api/detalle-compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(uid ? { "X-USER-ID": uid } : {}),
        },
        body: JSON.stringify({
          cantidad: form.cantidad,
          precio_unitario: form.precio_unitario,
          subtotal,
          id_comp: selectedCompra.id_comp,
          id_mat: selectedMaterial.id_mat,
        }),
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
        if (
          fieldErrors &&
          Object.keys(fieldErrors).some((k) =>
            ["cantidad", "precio_unitario", "subtotal"].includes(k)
          )
        ) {
          setStep(3);
        }
        setIsSubmitting(false);
        return;
      }

      const data = responseData?.data || responseData;
      setDetallesCompra((prev) => [
        ...prev,
        {
          ...data,
          compramaterial: { fec_comp: selectedCompra.fec_comp },
          material: { nom_mat: selectedMaterial.nom_mat },
        },
      ]);
      Swal.fire({
        icon: "success",
        title: "¡Detalle agregado!",
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
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6" />
            Agregar Detalle de Compra
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
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                Seleccionar Compra
              </h3>
              <SearchInput
                value={compraSearch}
                onChange={setCompraSearch}
                placeholder="Buscar compra..."
              />
              {loadingCompra ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {compras.length > 0 ? (
                      compras.map((c) => (
                        <CompraCard
                          key={c.id_comp}
                          compra={c}
                          isSelected={selectedCompra?.id_comp === c.id_comp}
                          onSelect={() => setSelectedCompra(c)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron compras</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={compraPag}
                    onPageChange={(p) => fetchCompras(p, compraSearch)}
                    isLoading={loadingCompra}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Boxes className="w-5 h-5 text-teal-600" />
                Seleccionar Material
              </h3>
              <SearchInput
                value={materialSearch}
                onChange={setMaterialSearch}
                placeholder="Buscar material..."
              />
              {loadingMaterial ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                    {materiales.length > 0 ? (
                      materiales.map((m) => (
                        <MaterialCard
                          key={m.id_mat}
                          material={m}
                          isSelected={selectedMaterial?.id_mat === m.id_mat}
                          onSelect={() => setSelectedMaterial(m)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No se encontraron materiales</p>
                      </div>
                    )}
                  </div>
                  <MiniPagination
                    pagination={materialPag}
                    onPageChange={(p) => fetchMateriales(p, materialSearch)}
                    isLoading={loadingMaterial}
                  />
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                Detalles del Ítem
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Hash className="w-4 h-4 text-emerald-500" />
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Precio Unit. (Bs.)
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {subtotal.toFixed(2)} Bs.
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Detalle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="w-6 h-6 text-emerald-600" />
                    <span className="font-semibold">Compra</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedCompra?.cod_comp}
                  </p>
                  <p className="font-medium">{selectedCompra?.fec_comp}</p>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Boxes className="w-6 h-6 text-teal-600" />
                    <span className="font-semibold">Material</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedMaterial?.cod_mat}
                  </p>
                  <p className="font-medium">{selectedMaterial?.nom_mat}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Cantidad</p>
                    <p className="text-lg font-bold">{form.cantidad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio Unit.</p>
                    <p className="text-lg font-bold">
                      {form.precio_unitario} Bs.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {subtotal.toFixed(2)} Bs.
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
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
              {isSubmitting ? "Guardando..." : "Confirmar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
