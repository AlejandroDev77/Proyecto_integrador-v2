import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Smartphone, CheckCircle, Loader2, Info } from "lucide-react";

interface QrScannerSimulatorProps {
  onScanSuccess: () => void;
  totalAmount: number;
}

export default function QrScannerSimulator({ onScanSuccess, totalAmount }: QrScannerSimulatorProps) {
  const [status, setStep] = useState<"generating" | "scanning" | "processing" | "success">("generating");
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generate a static dummy QR for simulation
    const dummyData = "https://changuitostudio.com/pago-simulado";
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dummyData)}&color=4c1d95&margin=10`;
    setQrUrl(qrImage);

    // Sequence of simulation
    const timer = setTimeout(() => setStep("scanning"), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSimulateScan = () => {
    setStep("processing");
    // Simulate verification delay
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onScanSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl max-w-sm mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Pago por QR</h3>
        <p className="text-xs text-gray-500">Escanea el código para pagar</p>
      </div>

      <div className="relative group">
        {/* QR Code Container */}
        <div className="relative w-64 h-64 bg-white p-3 rounded-2xl border-4 border-gray-50 shadow-inner flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {status === "generating" ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                <p className="text-xs font-medium text-gray-400">Generando QR...</p>
              </motion.div>
            ) : status === "success" ? (
              <motion.div 
                key="success"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-2 text-green-500"
              >
                <CheckCircle className="w-20 h-20" />
                <p className="font-bold text-lg">¡Escaneo Exitoso!</p>
              </motion.div>
            ) : (
              <motion.div 
                key="qr"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex items-center justify-center"
              >
                <img 
                  src={qrUrl} 
                  alt="QR de Pago" 
                  className={`w-56 h-56 transition-all duration-500 ${status === "processing" ? "blur-sm opacity-50" : "opacity-100"}`}
                />
                
                {status === "scanning" && (
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-purple-500 z-20 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                    animate={{ top: ["5%", "95%", "5%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                )}

                {status === "processing" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                    <p className="text-sm font-bold text-purple-700 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      Verificando pago...
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Corner Decorations */}
        <div className={`absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg transition-colors duration-500 ${status === "success" ? "border-green-500" : "border-purple-500"}`} />
        <div className={`absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg transition-colors duration-500 ${status === "success" ? "border-green-500" : "border-purple-500"}`} />
        <div className={`absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg transition-colors duration-500 ${status === "success" ? "border-green-500" : "border-purple-500"}`} />
        <div className={`absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 rounded-br-lg transition-colors duration-500 ${status === "success" ? "border-green-500" : "border-purple-500"}`} />
      </div>

      <div className="mt-6 w-full space-y-4">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total a pagar</span>
          <span className="text-lg font-bold text-purple-700 dark:text-purple-400">Bs. {totalAmount.toLocaleString()}</span>
        </div>

        {status === "scanning" && (
          <button
            onClick={handleSimulateScan}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 group active:scale-95"
          >
            <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Simular Escaneo
          </button>
        )}
      </div>
      
      <p className="mt-4 text-[9px] text-gray-400 text-center uppercase tracking-widest font-medium">
        Secure Transaction Simulation
      </p>
    </div>
  );
}
