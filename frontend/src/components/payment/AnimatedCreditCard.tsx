import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, User, Calendar, Lock } from "lucide-react";

interface AnimatedCreditCardProps {
  onComplete?: (cardData: any) => void;
}

export default function AnimatedCreditCard({ onComplete }: AnimatedCreditCardProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Formatting helpers
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 3) {
      return `${digits.substring(0, 2)}/${digits.substring(2)}`;
    }
    return digits;
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-4">
      {/* 3D Card Visual */}
      <div className="relative w-full h-56 perspective-1000">
        <motion.div
          className="relative w-full h-full transition-all duration-700 preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-6 text-white shadow-2xl backface-hidden"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-10 bg-yellow-400/80 rounded-lg flex items-center justify-center">
                <div className="w-8 h-6 border border-black/20 rounded-md" />
              </div>
              <CreditCard className="w-10 h-10 opacity-50" />
            </div>

            <div className="mb-8">
              <p className="text-2xl tracking-[0.2em] font-mono h-8">
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex-1">
                <p className="text-[10px] uppercase opacity-60 mb-1">Titular</p>
                <p className="text-sm font-medium tracking-wider truncate uppercase">
                  {cardName || "NOMBRE DEL TITULAR"}
                </p>
              </div>
              <div className="w-20">
                <p className="text-[10px] uppercase opacity-60 mb-1">Vence</p>
                <p className="text-sm font-medium tracking-wider">
                  {expiry || "MM/AA"}
                </p>
              </div>
            </div>
            
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl pointer-events-none" />
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl text-white shadow-2xl backface-hidden"
            style={{
              background: "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="w-full h-12 bg-black/80 mt-8 mb-6" />
            <div className="px-6">
              <p className="text-[10px] uppercase opacity-60 mb-1 text-right pr-2">CVV</p>
              <div className="w-full h-10 bg-white rounded flex items-center justify-end px-3">
                <p className="text-black font-mono font-bold tracking-widest italic">
                  {cvv || "•••"}
                </p>
              </div>
              <div className="mt-6 opacity-30 text-[8px] leading-tight">
                Esta tarjeta es una simulación para fines de demostración. 
                No ingrese datos reales de tarjetas bancarias. 
                Propiedad de Changuito Studio.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-2 gap-4 w-full bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5 ml-1">
            Número de Tarjeta
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              onFocus={() => { setIsFlipped(false); setFocusedField("number"); }}
              placeholder="0000 0000 0000 0000"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5 ml-1">
            Nombre en la Tarjeta
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onFocus={() => { setIsFlipped(false); setFocusedField("name"); }}
              placeholder="JUAN PEREZ"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5 ml-1">
            Vencimiento
          </label>
          <div className="relative">
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              onFocus={() => { setIsFlipped(false); setFocusedField("expiry"); }}
              placeholder="MM/AA"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5 ml-1">
            CVV
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              placeholder="123"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
