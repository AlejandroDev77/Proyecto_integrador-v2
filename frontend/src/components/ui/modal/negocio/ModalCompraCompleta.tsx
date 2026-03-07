import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Package,
  Truck,
  UserCheck,
  Boxes,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Trash2,
} from "lucide-react";

interface Proveedor {
  id_prov: number;
  nom_prov: string;
  contacto_prov: string;
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
}
interface Material {
  id_mat: number;
  nom_mat: string;
  cod_mat: string;
  costo_mat: number;
  stock_mat: number;
  unidad_medida: string;
}
interface DetalleItem {
  id_mat: number;
  nom_mat: string;
  cantidad: number;
  precio_unitario: number;
  unidad: string;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const API = "http://localhost:8000/api";

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { label: string; icon: React.ReactNode }[];
}) {
  return (
    <div className="flex items-center justify-center w-full px-2 py-4">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                idx + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : idx + 1 === currentStep
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {idx + 1 < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={`mt-1 text-xs font-medium hidden sm:block ${
                idx + 1 === currentStep ? "text-purple-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-1 mx-1 rounded ${
                idx + 1 < currentStep
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

export default function ModalCompraCompleta({
  showModal,
  setShowModal,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(
    null
  );
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [searchProv, setSearchProv] = useState("");
  const [searchMat, setSearchMat] = useState("");

  const steps = [
    { label: "Proveedor", icon: <Truck className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Materiales", icon: <Boxes className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchData = useCallback(async () => {
    try {
      const [pRes, eRes, mRes] = await Promise.all([
        fetch(`${API}/proveedor?per_page=100`),
        fetch(`${API}/empleados?per_page=100`),
        fetch(`${API}/materiales?per_page=100`),
      ]);
      const [pData, eData, mData] = await Promise.all([
        pRes.json(),
        eRes.json(),
        mRes.json(),
      ]);
      setProveedores(pData.data || pData);
      setEmpleados(eData.data || eData);
      setMateriales(mData.data || mData);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (showModal) fetchData();
  }, [showModal, fetchData]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedProveedor(null);
    setSelectedEmpleado(null);
    setDetalles([]);
  };

  const addMaterial = (m: Material) => {
    if (detalles.find((d) => d.id_mat === m.id_mat)) return;
    setDetalles([
      ...detalles,
      {
        id_mat: m.id_mat,
        nom_mat: m.nom_mat,
        cantidad: 1,
        precio_unitario: m.costo_mat,
        unidad: m.unidad_medida,
      },
    ]);
  };

  const updateDetalle = (idx: number, field: string, value: number) => {
    const updated = [...detalles];
    (updated[idx] as any)[field] = value;
    setDetalles(updated);
  };

  const removeDetalle = (idx: number) =>
    setDetalles(detalles.filter((_, i) => i !== idx));

  const totalCompra = detalles.reduce(
    (s, d) => s + d.cantidad * d.precio_unitario,
    0
  );

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedProveedor;
      case 2:
        return !!selectedEmpleado;
      case 3:
        return detalles.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedProveedor || !selectedEmpleado || detalles.length === 0)
      return;
    setIsSubmitting(true);
    try {
      const payload = {
        compra: {
          fec_comp: new Date().toISOString().split("T")[0],
          id_prov: selectedProveedor.id_prov,
          id_emp: selectedEmpleado.id_emp,
        },
        detalles: detalles.map((d) => ({
          id_mat: d.id_mat,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
        })),
      };
      const res = await fetch(`${API}/negocio/compra-completa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire({
        icon: "success",
        title: "¡Compra Procesada!",
        text: `Código: ${data.data.compra.cod_comp}`,
        timer: 2500,
      });
      handleClose();
    } catch (e: any) {
      Swal.fire({ icon: "error", title: "Error", text: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  const filteredProveedores = proveedores.filter((p) =>
    p.nom_prov.toLowerCase().includes(searchProv.toLowerCase())
  );
  const filteredMateriales = materiales.filter((m) =>
    `${m.nom_mat} ${m.cod_mat}`.toLowerCase().includes(searchMat.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6" />
            Compra de Materiales
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                Seleccionar Proveedor
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchProv}
                  onChange={(e) => setSearchProv(e.target.value)}
                  placeholder="Buscar proveedor..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {filteredProveedores.map((p) => (
                  <div
                    key={p.id_prov}
                    onClick={() => setSelectedProveedor(p)}
                    className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${
                      selectedProveedor?.id_prov === p.id_prov
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="font-medium">{p.nom_prov}</p>
                    <p className="text-sm text-gray-500">{p.contacto_prov}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                Empleado que registra
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {empleados.map((e) => (
                  <div
                    key={e.id_emp}
                    onClick={() => setSelectedEmpleado(e)}
                    className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${
                      selectedEmpleado?.id_emp === e.id_emp
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="font-medium">
                      {e.nom_emp} {e.ap_pat_emp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Boxes className="w-5 h-5 text-purple-600" />
                Agregar Materiales
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchMat}
                  onChange={(e) => setSearchMat(e.target.value)}
                  placeholder="Buscar material..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
                {filteredMateriales.slice(0, 12).map((m) => (
                  <button
                    key={m.id_mat}
                    onClick={() => addMaterial(m)}
                    className="flex items-center gap-2 p-2 rounded-lg border hover:bg-purple-50 text-left"
                  >
                    <Plus className="w-4 h-4 text-purple-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {m.nom_mat}
                      </p>
                      <p className="text-xs text-gray-500">
                        {m.costo_mat} Bs. | Stock: {m.stock_mat}{" "}
                        {m.unidad_medida}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {detalles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Materiales agregados:</h4>
                  {detalles.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{d.nom_mat}</p>
                        <p className="text-xs text-gray-500">{d.unidad}</p>
                      </div>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={d.cantidad}
                        onChange={(e) =>
                          updateDetalle(idx, "cantidad", +e.target.value)
                        }
                        className="w-20 px-2 py-1 rounded border text-center text-sm"
                      />
                      <input
                        type="number"
                        value={d.precio_unitario}
                        onChange={(e) =>
                          updateDetalle(idx, "precio_unitario", +e.target.value)
                        }
                        className="w-24 px-2 py-1 rounded border text-center text-sm"
                      />
                      <span className="font-semibold text-purple-600 w-24 text-right">
                        {(d.cantidad * d.precio_unitario).toFixed(2)} Bs.
                      </span>
                      <button
                        onClick={() => removeDetalle(idx)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Compra
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-gray-500">Proveedor</p>
                  <p className="font-medium">{selectedProveedor?.nom_prov}</p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <p className="text-sm text-gray-500">Empleado</p>
                  <p className="font-medium">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="font-medium mb-2">
                  Materiales ({detalles.length})
                </p>
                {detalles.map((d, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm py-1 border-b last:border-0"
                  >
                    <span>
                      {d.cantidad} {d.unidad} {d.nom_mat}
                    </span>
                    <span>
                      {(d.cantidad * d.precio_unitario).toFixed(2)} Bs.
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {totalCompra.toFixed(2)} Bs.
                </p>
                <p className="text-sm text-purple-600">
                  Total de la compra (stock será actualizado)
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-xl font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
              {isSubmitting ? "Procesando..." : "Procesar Compra"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
