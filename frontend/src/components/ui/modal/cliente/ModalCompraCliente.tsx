import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import {
  ShoppingCart,
  User,
  Package,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Calendar,
  CheckCircle,
  Loader2,
} from "lucide-react";
import type { CartItem } from "../../../../context/CartContext";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  cartItems: CartItem[];
  onSuccess: () => void;
}

const API = "http://localhost:8080/api";

interface ClienteInfo {
  id_cli: number;
  nom_cli: string;
  ap_pat_cli: string;
  cel_cli: string;
  dir_cli: string;
}

type PaymentMethod = "efectivo" | "transferencia" | "qr";

const paymentMethods = [
  {
    id: "efectivo" as PaymentMethod,
    label: "Efectivo",
    icon: Banknote,
    color: "green",
  },
  {
    id: "transferencia" as PaymentMethod,
    label: "Transferencia",
    icon: CreditCard,
    color: "blue",
  },
  { id: "qr" as PaymentMethod, label: "QR", icon: Smartphone, color: "purple" },
];

export default function ModalCompraCliente({
  showModal,
  setShowModal,
  cartItems,
  onSuccess,
}: Props) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [direccion, setDireccion] = useState("");
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [cliente, setCliente] = useState<ClienteInfo | null>(null);
  const [loadingCliente, setLoadingCliente] = useState(false);

  useEffect(() => {
    if (showModal) {
      setStep(1);
      setOrderCreated(null);
      fetchCliente();
    }
  }, [showModal]);

  const fetchCliente = async () => {
    setLoadingCliente(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCliente(null);
        return;
      }

      // Decodificar token para obtener id_usu
      const decoded: any = jwtDecode(token);
      const idUsu = decoded.id_usu;

      if (!idUsu) {
        setCliente(null);
        return;
      }

      // Llamar al endpoint público para obtener cliente por id_usu
      const res = await fetch(`${API}/cliente/por-usuario/${idUsu}`);

      if (res.ok) {
        const data = await res.json();
        setCliente(data);
        if (data.dir_cli) {
          setDireccion(data.dir_cli);
        }
      } else {
        setCliente(null);
      }
    } catch {
      setCliente(null);
    } finally {
      setLoadingCliente(false);
    }
  };

  if (!showModal) return null;

  // Loading state
  if (loadingCliente) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    if (orderCreated) {
      onSuccess();
    }
    setShowModal(false);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.precio_venta * item.cantidad,
    0
  );

  const handleSubmit = async () => {
    if (!cliente?.id_cli) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe iniciar sesión como cliente para realizar la compra",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create venta via cliente portal
      const detalles = cartItems.map((item) => ({
        id_mue: item.id_mue,
        cantidad: item.cantidad,
        precio_unitario: item.precio_venta,
        descuento_item: 0,
      }));

      const res = await fetch(`${API}/cliente/compra-directa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": cliente.id_cli.toString(),
        },
        body: JSON.stringify({
          id_cli: cliente.id_cli,
          metodo_pago: paymentMethod,
          direccion_entrega: direccion,
          detalles,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al procesar la compra");
      }

      setOrderCreated(data);
      setStep(3);

      Swal.fire({
        icon: "success",
        title: "¡Compra Exitosa!",
        text: `Tu pedido #${data.cod_ven || data.id_ven} ha sido registrado`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "No se pudo procesar la compra",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    if (step === 1) return cartItems.length > 0;
    if (step === 2) return paymentMethod && direccion.trim().length > 5;
    return false;
  };

  const stepLabels = [
    { label: "Revisar", icon: <Package className="w-4 h-4" /> },
    { label: "Pago", icon: <CreditCard className="w-4 h-4" /> },
    { label: "Confirmación", icon: <Check className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Finalizar Compra</h2>
              <p className="text-white/70 text-sm">
                {cartItems.length} producto{cartItems.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/20 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    step > i + 1
                      ? "bg-green-100 text-green-700"
                      : step === i + 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > i + 1 ? <Check className="w-4 h-4" /> : s.icon}
                  {s.label}
                </div>
                {i < stepLabels.length - 1 && (
                  <ChevronRight className="w-5 h-5 mx-2 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Review */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
                Revisa tu pedido
              </h3>

              {/* Client Info */}
              {cliente && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {cliente.nom_cli} {cliente.ap_pat_cli}
                      </p>
                      <p className="text-sm text-gray-500">{cliente.cel_cli}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id_mue}
                    className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                  >
                    {item.img_mue ? (
                      <img
                        src={item.img_mue.replace("public", "")}
                        alt={item.nom_mue}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {item.nom_mue}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        Bs.{" "}
                        {(item.precio_venta * item.cantidad).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Bs. {item.precio_venta.toLocaleString()} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                Método de pago y entrega
              </h3>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selecciona cómo deseas pagar:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                        paymentMethod === pm.id
                          ? `border-${pm.color}-500 bg-${pm.color}-50 dark:bg-${pm.color}-900/20`
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <pm.icon
                        className={`w-6 h-6 ${
                          paymentMethod === pm.id
                            ? `text-${pm.color}-500`
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          paymentMethod === pm.id
                            ? `text-${pm.color}-700 dark:text-${pm.color}-300`
                            : "text-gray-600"
                        }`}
                      >
                        {pm.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Dirección de entrega:
                </label>
                <textarea
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ingresa la dirección completa de entrega..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Total a pagar:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    Bs. {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                ¡Compra Realizada!
              </h3>
              <p className="text-gray-500 mb-6">
                Tu pedido ha sido registrado exitosamente
              </p>

              {orderCreated && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Código de pedido</p>
                      <p className="font-bold text-lg">
                        {orderCreated.cod_ven || `#${orderCreated.id_ven}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-lg text-green-600">
                        Bs. {total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Método de pago</p>
                      <p className="font-medium capitalize">{paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500 mb-4">
                Nos pondremos en contacto contigo para coordinar la entrega.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
          {step !== 3 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                Bs. {total.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && step < 3 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Atrás
              </button>
            )}

            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                disabled={!canGoNext()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl font-semibold transition"
              >
                Continuar al pago
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleSubmit}
                disabled={!canGoNext() || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl font-semibold transition"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirmar Compra
                  </>
                )}
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
