import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, Smartphone, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MobilePaymentSimulation() {
  const { id } = useParams();
  const [status, setStatus] = useState<"pending" | "processing" | "success" | "error">("pending");

  const handleConfirm = async () => {
    setStatus("processing");
    try {
      const res = await fetch(`http://${window.location.hostname}:8080/api/pago-simulado/confirmar/${id}`, {
        method: "POST"
      });
      if (res.ok) {
        setTimeout(() => setStatus("success"), 1500);
      } else {
        setStatus("error");
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-purple-600 p-8 text-center text-white">
          <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-bold">Changuito Pay</h1>
          <p className="text-purple-100 text-sm">Simulación de Pago Móvil</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {status === "pending" && (
            <div className="space-y-6 text-center">
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">ID de Transacción</p>
                <p className="text-purple-900 font-mono font-bold">{id}</p>
              </div>
              
              <div className="flex items-center gap-3 text-left bg-gray-50 p-4 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Estás a punto de autorizar un pago seguro para <strong>Changuito Studio</strong>.
                </p>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                Confirmar y Pagar
              </button>
              
              <p className="text-[10px] text-gray-400 uppercase tracking-tight">
                Esta es una demostración segura. No se debitará dinero real.
              </p>
            </div>
          )}

          {status === "processing" && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-12 animate-spin text-purple-600" />
              <p className="font-bold text-gray-700 text-xl">Procesando...</p>
              <p className="text-gray-500 text-sm">Comunicando con tu banco</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-8 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800">¡Pago Exitoso!</h2>
              <p className="text-gray-500">Puedes volver a la pantalla de tu computadora.</p>
              <div className="pt-4">
                <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                  Transacción Finalizada
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl text-red-500">!</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Error en el Pago</h2>
              <p className="text-gray-500 text-sm">No pudimos procesar la confirmación. Intenta escaneando de nuevo.</p>
              <button
                onClick={() => window.location.reload()}
                className="text-purple-600 font-bold"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      <p className="mt-8 text-gray-400 text-xs">© 2026 Changuito Studio S.R.L.</p>
    </div>
  );
}
