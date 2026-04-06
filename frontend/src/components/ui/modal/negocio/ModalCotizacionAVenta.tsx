import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  FileText,
  UserCheck,
  ClipboardCheck,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  ArrowRightCircle,
  CreditCard,
  Banknote,
  DollarSign,
} from "lucide-react";

interface Cotizacion {
  id_cot: number;
  cod_cot: string;
  fec_cot: string;
  est_cot: string;
  total_cot: number;
  cliente?: { nom_cli: string; ap_pat_cli: string };
}
interface Empleado {
  id_emp: number;
  nom_emp: string;
  ap_pat_emp: string;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const API = "http://localhost:8080/api";

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
                  ? "bg-blue-600 text-white shadow-lg"
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
                idx + 1 === currentStep ? "text-blue-600" : "text-gray-500"
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

export default function ModalCotizacionAVenta({
  showModal,
  setShowModal,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedCotizacion, setSelectedCotizacion] =
    useState<Cotizacion | null>(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [registrarPago, setRegistrarPago] = useState(true);
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const steps = [
    { label: "Cotización", icon: <FileText className="w-4 h-4" /> },
    { label: "Empleado", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Confirmar", icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const fetchData = useCallback(async () => {
    try {
      const [cRes, eRes] = await Promise.all([
        fetch(`${API}/cotizacion?filter[est_cot]=Pendiente&per_page=100`),
        fetch(`${API}/empleados?per_page=100`),
      ]);
      const [cData, eData] = await Promise.all([cRes.json(), eRes.json()]);
      setCotizaciones(cData.data || cData);
      setEmpleados(eData.data || eData);
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
    setSelectedCotizacion(null);
    setSelectedEmpleado(null);
  };

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!selectedCotizacion;
      case 2:
        return !!selectedEmpleado;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!selectedCotizacion || !selectedEmpleado) return;
    setIsSubmitting(true);
    try {
      const payload = {
        id_emp: selectedEmpleado.id_emp,
        registrar_pago: registrarPago,
        ...(registrarPago && {
          pago: { monto: selectedCotizacion.total_cot, metodo_pag: metodoPago },
        }),
      };
      const res = await fetch(
        `${API}/negocio/cotizacion-a-venta/${selectedCotizacion.id_cot}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire({
        icon: "success",
        title: "¡Cotización Convertida!",
        text: `Nueva venta: ${data.data.venta.cod_ven}`,
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

  const filteredCotizaciones = cotizaciones.filter((c) =>
    `${c.cod_cot} ${c.cliente?.nom_cli}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <ArrowRightCircle className="w-6 h-6" />
            Cotización a Venta
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
                <FileText className="w-5 h-5 text-blue-600" /> Seleccionar
                Cotización Pendiente
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cotización..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
                {filteredCotizaciones.map((c) => (
                  <div
                    key={c.id_cot}
                    onClick={() => setSelectedCotizacion(c)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      selectedCotizacion?.id_cot === c.id_cot
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm text-gray-500">
                          {c.cod_cot}
                        </p>
                        <p className="font-medium">
                          {c.cliente?.nom_cli} {c.cliente?.ap_pat_cli}
                        </p>
                        <p className="text-sm text-gray-500">{c.fec_cot}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                          {c.est_cot}
                        </span>
                        <p className="font-bold text-blue-600 mt-2">
                          {c.total_cot} Bs.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredCotizaciones.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No hay cotizaciones pendientes
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" /> Empleado que
                procesa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {empleados.map((e) => (
                  <div
                    key={e.id_emp}
                    onClick={() => setSelectedEmpleado(e)}
                    className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${
                      selectedEmpleado?.id_emp === e.id_emp
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="font-medium">
                      {e.nom_emp} {e.ap_pat_emp}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <input
                    type="checkbox"
                    checked={registrarPago}
                    onChange={(e) => setRegistrarPago(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label className="font-medium">Registrar pago ahora</label>
                </div>
                {registrarPago && (
                  <div className="grid grid-cols-3 gap-3">
                    {["Efectivo", "Tarjeta", "Transferencia"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMetodoPago(m)}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center ${
                          metodoPago === m
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        {m === "Efectivo" && <Banknote className="w-6 h-6" />}
                        {m === "Tarjeta" && <CreditCard className="w-6 h-6" />}
                        {m === "Transferencia" && (
                          <DollarSign className="w-6 h-6" />
                        )}
                        <span className="text-sm font-medium">{m}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-green-600" /> Confirmar
                Conversión
              </h3>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cotización:</span>
                  <span className="font-mono font-medium">
                    {selectedCotizacion?.cod_cot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">
                    {selectedCotizacion?.cliente?.nom_cli}{" "}
                    {selectedCotizacion?.cliente?.ap_pat_cli}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Empleado:</span>
                  <span className="font-medium">
                    {selectedEmpleado?.nom_emp} {selectedEmpleado?.ap_pat_emp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método Pago:</span>
                  <span className="font-medium">
                    {registrarPago ? metodoPago : "Sin pago"}
                  </span>
                </div>
                <hr className="border-blue-200" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {selectedCotizacion?.total_cot} Bs.
                  </span>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> Esta acción creará una venta,
                  descontará stock de muebles y cambiará el estado de la
                  cotización a "Aprobada".
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
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold"
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
              {isSubmitting ? "Procesando..." : "Convertir a Venta"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
