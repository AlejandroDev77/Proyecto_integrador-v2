import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  RotateCcw,
  ShoppingBag,
  Armchair,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Trash2,
} from "lucide-react";

interface Venta {
  id_ven: number;
  cod_ven: string;
  fec_ven: string;
  total_ven: number;
  cliente?: { nom_cli: string; ap_pat_cli?: string };
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
}
interface DetalleVenta {
  id_det_ven: number;
  id_mue: number;
  cantidad: number;
  precio_unitario: number;
  mueble?: { nom_mue: string };
}
interface DetalleItem {
  id_mue: number;
  nom_mue: string;
  cantidad: number;
  precio_unitario: number;
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
                  ? "bg-orange-600 text-white shadow-lg"
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
                idx + 1 === currentStep ? "text-orange-600" : "text-gray-500"
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

export default function ModalDevolucion({ showModal, setShowModal }: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [detallesVenta, setDetallesVenta] = useState<DetalleVenta[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [motivo, setMotivo] = useState("");
  const [search, setSearch] = useState("");

  const steps = [
    { label: "Venta", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Productos", icon: <Armchair className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  // Calcular fecha de hace 7 días para política de devolución
  const get7DaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  };

  // Calcular días restantes para devolución
  const getDaysRemaining = (fec_ven: string) => {
    const saleDate = new Date(fec_ven);
    const today = new Date();
    const diffTime =
      7 -
      Math.floor(
        (today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    return Math.max(0, diffTime);
  };

  const fetchData = useCallback(async () => {
    try {
      const sevenDaysAgo = get7DaysAgo();
      const [vRes, eRes] = await Promise.all([
        // Solo ventas completadas de los últimos 7 días
        fetch(
          `${API}/venta?filter[est_ven]=Completado&filter[fec_ven_desde]=${sevenDaysAgo}&per_page=100`
        ),
        fetch(`${API}/empleados?per_page=100`),
      ]);
      const [vData, eData] = await Promise.all([vRes.json(), eRes.json()]);
      setVentas(vData.data || vData);
      setEmpleados(eData.data || eData);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (showModal) fetchData();
  }, [showModal, fetchData]);

  const fetchDetallesVenta = async (id_ven: number) => {
    try {
      // Usar endpoint específico de venta para obtener detalles
      const res = await fetch(`${API}/venta/${id_ven}`);
      const ventaData = await res.json();

      // Obtener los detalles desde el endpoint de detalles pero sin filtro que cause error
      const detRes = await fetch(`${API}/detalle-venta?per_page=200`);
      const detData = await detRes.json();
      const allDetalles = detData.data || detData;

      // Filtrar en el frontend por id_ven
      const filteredDetalles = allDetalles.filter(
        (d: any) => d.id_ven === id_ven
      );
      setDetallesVenta(filteredDetalles);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedVenta) fetchDetallesVenta(selectedVenta.id_ven);
  }, [selectedVenta]);

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setSelectedVenta(null);
    setSelectedEmpleado(null);
    setDetalles([]);
    setMotivo("");
  };

  const addProducto = (d: DetalleVenta) => {
    if (detalles.find((x) => x.id_mue === d.id_mue)) return;
    setDetalles([
      ...detalles,
      {
        id_mue: d.id_mue,
        nom_mue: d.mueble?.nom_mue || "Mueble",
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
      },
    ]);
  };

  const updateCantidad = (idx: number, val: number) => {
    const updated = [...detalles];
    updated[idx].cantidad = val;
    setDetalles(updated);
  };

  const removeDetalle = (idx: number) =>
    setDetalles(detalles.filter((_, i) => i !== idx));

  const totalDev = detalles.reduce(
    (s, d) => s + d.cantidad * d.precio_unitario,
    0
  );

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedVenta && !!selectedEmpleado;
      case 2:
        return detalles.length > 0 && motivo.trim().length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedVenta || !selectedEmpleado || detalles.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload = {
        devolucion: {
          fec_dev: new Date().toISOString().split("T")[0],
          motivo_dev: motivo,
          id_ven: selectedVenta.id_ven,
          id_emp: selectedEmpleado.id_emp,
        },
        detalles: detalles.map((d) => ({
          id_mue: d.id_mue,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
        })),
      };
      const res = await fetch(`${API}/negocio/devolucion-completa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire({
        icon: "success",
        title: "¡Devolución Procesada!",
        text: `Código: ${data.data.devolucion.cod_dev}`,
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

  const filteredVentas = ventas.filter((v) =>
    `${v.cod_ven} ${v.cliente?.nom_cli}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <RotateCcw className="w-6 h-6" />
            Procesar Devolución
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
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                Seleccionar Venta y Empleado
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar venta..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              {/* Mensaje de política de devolución */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mb-2">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Política:</strong> Solo se muestran ventas de los
                  últimos <strong>7 días</strong> elegibles para devolución.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                {filteredVentas.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-gray-500">
                    <RotateCcw className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay ventas elegibles para devolución</p>
                    <p className="text-sm">
                      Solo ventas de los últimos 7 días pueden ser devueltas
                    </p>
                  </div>
                ) : (
                  filteredVentas.map((v) => {
                    const daysLeft = getDaysRemaining(v.fec_ven);
                    return (
                      <div
                        key={v.id_ven}
                        onClick={() => setSelectedVenta(v)}
                        className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${
                          selectedVenta?.id_ven === v.id_ven
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-mono text-sm text-gray-500">
                            {v.cod_ven}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              daysLeft <= 2
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {daysLeft} días restantes
                          </span>
                        </div>
                        <p className="font-medium">
                          {v.cliente?.nom_cli} {v.cliente?.ap_pat_cli}
                        </p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">{v.fec_ven}</p>
                          <p className="text-sm text-orange-600 font-semibold">
                            {v.total_ven} Bs.
                          </p>
                        </div>
                        {selectedVenta?.id_ven === v.id_ven && (
                          <Check className="absolute top-2 right-2 w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              <h4 className="font-medium mt-4">Empleado que procesa:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {empleados.map((e) => (
                  <div
                    key={e.id_emp}
                    onClick={() => setSelectedEmpleado(e)}
                    className={`cursor-pointer rounded-lg border-2 p-2 text-sm ${
                      selectedEmpleado?.id_emp === e.id_emp
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    {e.nom_emp} {e.ap_pat_emp}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Armchair className="w-5 h-5 text-orange-600" />
                Productos a Devolver
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
                {detallesVenta.map((d) => (
                  <button
                    key={d.id_det_ven}
                    onClick={() => addProducto(d)}
                    className="flex items-center gap-2 p-2 rounded-lg border hover:bg-orange-50 text-left"
                  >
                    <Plus className="w-4 h-4 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.mueble?.nom_mue}</p>
                      <p className="text-xs text-gray-500">
                        Cant: {d.cantidad} | {d.precio_unitario} Bs.
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {detalles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    Productos seleccionados:
                  </h4>
                  {detalles.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{d.nom_mue}</p>
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={d.cantidad}
                        onChange={(e) => updateCantidad(idx, +e.target.value)}
                        className="w-16 px-2 py-1 rounded border text-center text-sm"
                      />
                      <span className="font-semibold text-orange-600 w-24 text-right">
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
              <div className="mt-4">
                <label className="text-sm font-medium">
                  Motivo de Devolución *
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  className="w-full mt-1 px-4 py-2 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  placeholder="Describa el motivo..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
                Confirmar Devolución
              </h3>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span>Venta:</span>
                  <span className="font-mono">{selectedVenta?.cod_ven}</span>
                </div>
                <div className="flex justify-between">
                  <span>Empleado:</span>
                  <span>{selectedEmpleado?.nom_emp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{detalles.length}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-sm font-medium mb-2">Motivo:</p>
                <p className="text-gray-600 dark:text-gray-400">{motivo}</p>
              </div>
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {totalDev.toFixed(2)} Bs.
                </p>
                <p className="text-sm text-red-600">
                  Total a devolver (stock será restaurado)
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
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
              {isSubmitting ? "Procesando..." : "Procesar Devolución"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
