import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  Factory,
  Cog,
  Armchair,
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
  Tag,
} from "lucide-react";

interface DetalleProduccion {
  id_det_pro: number;
  cantidad: number;
  est_det_pro: string;
  id_pro: number;
  id_mue: number;
  produccion?: { fec_ini: string; fec_fin: string };
  mueble?: { nom_mue: string };
}
interface Produccion {
  id_pro: number;
  fec_ini: string;
  fec_fin: string;
  cod_pro?: string;
  est_pro?: string;
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue?: string;
}
interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setDetallesProducciones: React.Dispatch<
    React.SetStateAction<DetalleProduccion[]>
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
                  ? "bg-sky-600 text-white shadow-lg"
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
                index + 1 === currentStep ? "text-sky-600" : "text-gray-500"
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
          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 shadow-md"
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
          <Cog className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-mono">
            {produccion.cod_pro}
          </p>
          <h4 className="font-medium text-sm">
            {produccion.fec_ini} - {produccion.fec_fin}
          </h4>
          {produccion.est_pro && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                produccion.est_pro === "Completado"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {produccion.est_pro}
            </span>
          )}
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
          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md"
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
          <h4 className="font-medium text-sm truncate">{mueble.nom_mue}</h4>
        </div>
        {isSelected && <Check className="w-5 h-5 text-cyan-500" />}
      </div>
    </div>
  );
}

export default function ModalAgregarDetalleProduccion({
  showModal,
  setShowModal,
  setDetallesProducciones,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ cantidad: 1, est_det_pro: "Pendiente" });
  const [selectedProduccion, setSelectedProduccion] =
    useState<Produccion | null>(null);
  const [selectedMueble, setSelectedMueble] = useState<Mueble | null>(null);
  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [proSearch, setProSearch] = useState("");
  const [muebleSearch, setMuebleSearch] = useState("");
  const [proPag, setProPag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [mueblePag, setMueblePag] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });
  const [loadingPro, setLoadingPro] = useState(false);
  const [loadingMueble, setLoadingMueble] = useState(false);

  const steps = [
    { label: "Producción", icon: <Cog className="w-4 h-4" /> },
    { label: "Mueble", icon: <Armchair className="w-4 h-4" /> },
    { label: "Detalles", icon: <Calculator className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchProducciones = useCallback(async (page = 1, search = "") => {
    setLoadingPro(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/produccion?page=${page}&per_page=8${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      const p = await res.json();
      setProducciones(p?.data || []);
      setProPag({
        currentPage: p.current_page || 1,
        lastPage: p.last_page || 1,
        total: p.total || 0,
      });
    } catch {
      setProducciones([]);
    } finally {
      setLoadingPro(false);
    }
  }, []);
  const fetchMuebles = useCallback(async (page = 1, search = "") => {
    setLoadingMueble(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/mueble?page=${page}&per_page=8${
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
    const t = setTimeout(() => fetchProducciones(1, proSearch), 300);
    return () => clearTimeout(t);
  }, [proSearch, fetchProducciones]);
  useEffect(() => {
    const t = setTimeout(() => fetchMuebles(1, muebleSearch), 300);
    return () => clearTimeout(t);
  }, [muebleSearch, fetchMuebles]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedProduccion(null);
    setSelectedMueble(null);
    setForm({ cantidad: 1, est_det_pro: "Pendiente" });
  };
  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedProduccion;
      case 2:
        return !!selectedMueble;
      case 3:
        return form.cantidad > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedProduccion || !selectedMueble) return;
    setIsSubmitting(true);
    let uid = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        uid = (jwtDecode(token) as any).id_usu;
      }
    } catch {}
    try {
      const res = await fetch("http://localhost:8000/api/detalle-produccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(uid ? { "X-USER-ID": uid } : {}),
        },
        body: JSON.stringify({
          cantidad: form.cantidad,
          est_det_pro: form.est_det_pro,
          id_pro: selectedProduccion.id_pro,
          id_mue: selectedMueble.id_mue,
        }),
      });
      if (!res.ok) throw new Error("Error");
      const data = (await res.json())?.data;
      setDetallesProducciones((prev) => [
        ...prev,
        {
          ...data,
          produccion: {
            fec_ini: selectedProduccion.fec_ini,
            fec_fin: selectedProduccion.fec_fin,
          },
          mueble: { nom_mue: selectedMueble.nom_mue },
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
      Swal.fire({ icon: "error", title: "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Factory className="w-6 h-6" />
            Agregar Detalle de Producción
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
                <Cog className="w-5 h-5 text-sky-600" />
                Seleccionar Producción
              </h3>
              <SearchInput
                value={proSearch}
                onChange={setProSearch}
                placeholder="Buscar producción..."
              />
              {loadingPro ? (
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
                    pagination={proPag}
                    onPageChange={(p) => fetchProducciones(p, proSearch)}
                    isLoading={loadingPro}
                  />
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Armchair className="w-5 h-5 text-cyan-600" />
                Seleccionar Mueble
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

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-sky-600" />
                Detalles
              </h3>
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
                    <Tag className="w-4 h-4 text-sky-500" />
                    Estado
                  </label>
                  <select
                    value={form.est_det_pro}
                    onChange={(e) =>
                      setForm({ ...form, est_det_pro: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
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
                <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Cog className="w-6 h-6 text-sky-600" />
                    <span className="font-semibold">Producción</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedProduccion?.cod_pro}
                  </p>
                  <p className="font-medium">
                    {selectedProduccion?.fec_ini} -{" "}
                    {selectedProduccion?.fec_fin}
                  </p>
                </div>
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Armchair className="w-6 h-6 text-cyan-600" />
                    <span className="font-semibold">Mueble</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedMueble?.cod_mue}
                  </p>
                  <p className="font-medium">{selectedMueble?.nom_mue}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Cantidad</p>
                    <p className="text-lg font-bold">{form.cantidad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    <p className="text-lg font-bold text-sky-600">
                      {form.est_det_pro}
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
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
