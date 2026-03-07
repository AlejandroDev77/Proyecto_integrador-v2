import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  ShoppingCart,
  User,
  UserCheck,
  Armchair,
  Calculator,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Trash2,
  DollarSign,
  CreditCard,
  Banknote,
  ImageIcon,
  Package,
} from "lucide-react";

interface Cliente {
  id_cli: number;
  nom_cli: string;
  ap_pat_cli: string;
  ci_cli: string;
  img_cli?: string;
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
  img_emp?: string;
}
interface Mueble {
  id_mue: number;
  nom_mue: string;
  cod_mue: string;
  precio_venta: number;
  stock: number;
  img_mue?: string;
}
interface DetalleItem {
  id_mue: number;
  nom_mue: string;
  img_mue?: string;
  cantidad: number;
  precio_unitario: number;
  descuento_item: number;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const API = "http://localhost:8000/api";

// Helper para obtener URL de imagen
const getImageUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:8000/storage/${path}`;
};

// Componente de imagen con fallback
function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(src);

  if (!imageUrl || error) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${className}`}
      >
        <Package className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
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
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                idx + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : idx + 1 === currentStep
                  ? "bg-emerald-600 text-white shadow-lg"
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
                idx + 1 === currentStep ? "text-emerald-600" : "text-gray-500"
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

export default function ModalVentaCompleta({ showModal, setShowModal }: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [muebles, setMuebles] = useState<Mueble[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchMueble, setSearchMueble] = useState("");
  const [notas, setNotas] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [registrarPago, setRegistrarPago] = useState(true);

  const steps = [
    { label: "Cliente", icon: <User className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Productos", icon: <Armchair className="w-4 h-4" /> },
    { label: "Resumen", icon: <Calculator className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchData = useCallback(async () => {
    try {
      const [cRes, eRes, mRes] = await Promise.all([
        fetch(`${API}/clientes?per_page=100`),
        fetch(`${API}/empleados?per_page=100`),
        fetch(`${API}/mueble?per_page=100`),
      ]);
      const [cData, eData, mData] = await Promise.all([
        cRes.json(),
        eRes.json(),
        mRes.json(),
      ]);
      setClientes(cData.data || cData);
      setEmpleados(eData.data || eData);
      setMuebles(mData.data || mData);
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
    setSelectedCliente(null);
    setSelectedEmpleado(null);
    setDetalles([]);
    setNotas("");
    setDescuento(0);
  };

  const addMueble = (m: Mueble) => {
    if (detalles.find((d) => d.id_mue === m.id_mue)) return;
    setDetalles([
      ...detalles,
      {
        id_mue: m.id_mue,
        nom_mue: m.nom_mue,
        img_mue: m.img_mue,
        cantidad: 1,
        precio_unitario: Number(m.precio_venta) || 0,
        descuento_item: 0,
      },
    ]);
  };

  const updateDetalle = (idx: number, field: string, value: number) => {
    const updated = [...detalles];
    const safeValue = isNaN(value) ? 0 : value;
    (updated[idx] as any)[field] = safeValue;
    setDetalles(updated);
  };

  const removeDetalle = (idx: number) =>
    setDetalles(detalles.filter((_, i) => i !== idx));

  // Calcular subtotal de forma segura
  const calcSubtotal = (d: DetalleItem) => {
    const cant = Number(d.cantidad) || 0;
    const precio = Number(d.precio_unitario) || 0;
    const desc = Number(d.descuento_item) || 0;
    return cant * precio - cant * desc;
  };

  const totalVenta =
    detalles.reduce((sum, d) => sum + calcSubtotal(d), 0) -
    (Number(descuento) || 0);

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedCliente;
      case 2:
        return !!selectedEmpleado;
      case 3:
        return detalles.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedCliente || !selectedEmpleado || detalles.length === 0) return;
    setIsSubmitting(true);
    try {
      const payload = {
        venta: {
          fec_ven: new Date().toISOString().split("T")[0],
          est_ven: "Completada",
          total_ven: totalVenta,
          descuento: Number(descuento) || 0,
          id_cli: selectedCliente.id_cli,
          id_emp: selectedEmpleado.id_emp,
          notas,
        },
        detalles: detalles.map((d) => ({
          id_mue: d.id_mue,
          cantidad: Number(d.cantidad) || 1,
          precio_unitario: Number(d.precio_unitario) || 0,
          descuento_item: Number(d.descuento_item) || 0,
        })),
        ...(registrarPago && {
          pago: { monto: totalVenta, metodo_pag: metodoPago },
        }),
      };
      const res = await fetch(`${API}/negocio/venta-completa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire({
        icon: "success",
        title: "¡Venta Procesada!",
        text: `Código: ${data.data.venta.cod_ven}`,
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

  const filteredClientes = clientes.filter((c) =>
    `${c.nom_cli} ${c.ap_pat_cli} ${c.ci_cli}`
      .toLowerCase()
      .includes(searchCliente.toLowerCase())
  );
  const filteredMuebles = muebles.filter((m) =>
    `${m.nom_mue} ${m.cod_mue}`
      .toLowerCase()
      .includes(searchMueble.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Proceso de Venta Completa
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <StepIndicator currentStep={step} steps={steps} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Cliente */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" /> Seleccionar
                Cliente
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchCliente}
                  onChange={(e) => setSearchCliente(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
                {filteredClientes.map((c) => (
                  <div
                    key={c.id_cli}
                    onClick={() => setSelectedCliente(c)}
                    className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-3 ${
                      selectedCliente?.id_cli === c.id_cli
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                    }`}
                  >
                    <ProductImage
                      src={c.img_cli}
                      alt={c.nom_cli}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {c.nom_cli} {c.ap_pat_cli}
                      </p>
                      <p className="text-sm text-gray-500">CI: {c.ci_cli}</p>
                    </div>
                    {selectedCliente?.id_cli === c.id_cli && (
                      <Check className="w-5 h-5 text-emerald-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Empleado */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" /> Seleccionar
                Empleado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
                {empleados.map((e) => (
                  <div
                    key={e.id_emp}
                    onClick={() => setSelectedEmpleado(e)}
                    className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex items-center gap-3 ${
                      selectedEmpleado?.id_emp === e.id_emp
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                    }`}
                  >
                    <ProductImage
                      src={e.img_emp}
                      alt={e.nom_emp}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {e.nom_emp} {e.ap_pat_emp}
                      </p>
                    </div>
                    {selectedEmpleado?.id_emp === e.id_emp && (
                      <Check className="w-5 h-5 text-emerald-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Productos */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Armchair className="w-5 h-5 text-emerald-600" /> Agregar
                Productos
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchMueble}
                  onChange={(e) => setSearchMueble(e.target.value)}
                  placeholder="Buscar mueble..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                />
              </div>

              {/* Catálogo de muebles con imágenes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto">
                {filteredMuebles.slice(0, 16).map((m) => (
                  <button
                    key={m.id_mue}
                    onClick={() => addMueble(m)}
                    disabled={detalles.some((d) => d.id_mue === m.id_mue)}
                    className={`relative rounded-xl border overflow-hidden transition-all hover:shadow-lg ${
                      detalles.some((d) => d.id_mue === m.id_mue)
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-emerald-400"
                    }`}
                  >
                    <ProductImage
                      src={m.img_mue}
                      alt={m.nom_mue}
                      className="w-full h-24"
                    />
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <p className="text-xs font-medium truncate">
                        {m.nom_mue}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-emerald-600 font-bold">
                          {m.precio_venta} Bs.
                        </span>
                        <span className="text-xs text-gray-500">
                          Stock: {m.stock}
                        </span>
                      </div>
                    </div>
                    {!detalles.some((d) => d.id_mue === m.id_mue) && (
                      <div className="absolute top-1 right-1 p-1 bg-emerald-500 rounded-full text-white">
                        <Plus className="w-3 h-3" />
                      </div>
                    )}
                    {detalles.some((d) => d.id_mue === m.id_mue) && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-emerald-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Lista de productos agregados */}
              {detalles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm text-gray-600 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Carrito ({detalles.length} productos)
                  </h4>
                  {detalles.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <ProductImage
                        src={d.img_mue}
                        alt={d.nom_mue}
                        className="w-14 h-14 rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {d.nom_mue}
                        </p>
                        <p className="text-xs text-gray-500">
                          {d.precio_unitario} Bs. c/u
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Cant:</label>
                        <input
                          type="number"
                          min="1"
                          value={d.cantidad}
                          onChange={(e) =>
                            updateDetalle(
                              idx,
                              "cantidad",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 px-2 py-1 rounded border text-center text-sm dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <span className="font-semibold text-emerald-600 w-24 text-right">
                        {calcSubtotal(d).toFixed(2)} Bs.
                      </span>
                      <button
                        onClick={() => removeDetalle(idx)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-bold text-emerald-600">
                      Subtotal:{" "}
                      {detalles
                        .reduce((s, d) => s + calcSubtotal(d), 0)
                        .toFixed(2)}{" "}
                      Bs.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Resumen */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" /> Resumen y
                Pago
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Descuento Global (Bs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={descuento}
                    onChange={(e) =>
                      setDescuento(parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Notas</label>
                  <input
                    type="text"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Observaciones de la venta..."
                    className="w-full px-4 py-2 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <input
                  type="checkbox"
                  checked={registrarPago}
                  onChange={(e) => setRegistrarPago(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500"
                />
                <label className="font-medium">Registrar pago ahora</label>
              </div>
              {registrarPago && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      name: "Efectivo",
                      icon: <Banknote className="w-6 h-6" />,
                    },
                    {
                      name: "Tarjeta",
                      icon: <CreditCard className="w-6 h-6" />,
                    },
                    {
                      name: "Transferencia",
                      icon: <DollarSign className="w-6 h-6" />,
                    },
                  ].map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setMetodoPago(m.name)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        metodoPago === m.name
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700"
                          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      {m.icon}
                      <span className="text-sm font-medium">{m.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total a Pagar:</span>
                  <span className="text-emerald-600">
                    {totalVenta.toFixed(2)} Bs.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmar */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" /> Confirmar
                Venta
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-3">
                  <ProductImage
                    src={selectedCliente?.img_cli}
                    alt="Cliente"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-medium">
                      {selectedCliente?.nom_cli} {selectedCliente?.ap_pat_cli}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center gap-3">
                  <ProductImage
                    src={selectedEmpleado?.img_emp}
                    alt="Empleado"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Empleado</p>
                    <p className="font-medium">
                      {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="font-medium mb-3">
                  Productos ({detalles.length})
                </p>
                {detalles.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 border-b last:border-0 border-gray-200 dark:border-gray-700"
                  >
                    <ProductImage
                      src={d.img_mue}
                      alt={d.nom_mue}
                      className="w-10 h-10 rounded-lg"
                    />
                    <span className="flex-1 text-sm">
                      {d.cantidad}x {d.nom_mue}
                    </span>
                    <span className="font-medium">
                      {calcSubtotal(d).toFixed(2)} Bs.
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl text-center">
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {totalVenta.toFixed(2)} Bs.
                </p>
                <p className="text-sm text-green-600 mt-1">Total de la venta</p>
                {registrarPago && (
                  <p className="text-xs text-green-500 mt-2 flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Pago con {metodoPago}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold shadow-lg transition-colors"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              {isSubmitting ? "Procesando..." : "Procesar Venta"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
