import { AnimatePresence, motion } from "framer-motion";
import { Box, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Product } from "./types";

interface ProductTrayProps {
  products: Product[];
  showProductTray: boolean;
  setShowProductTray: (val: boolean) => void;
  addToRoom: (product: Product) => void;
}

export function ProductTray({
  products,
  showProductTray,
  setShowProductTray,
  addToRoom,
}: ProductTrayProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col items-center">
      {/* Toggle Button */}
      <button
        onClick={() => setShowProductTray(!showProductTray)}
        className="flex items-center gap-2 px-6 py-3 bg-[#a67c52] text-white rounded-full shadow-2xl shadow-[#a67c52]/30 hover:bg-[#8e6844] transition-all transform hover:-translate-y-1 z-30 font-semibold mb-4"
      >
        <Box className="w-5 h-5" />
        Muebles Disponibles ({products.length})
        {showProductTray ? (
          <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
        ) : (
          <ChevronUp className="w-4 h-4 ml-2 opacity-70" />
        )}
      </button>

      {/* Tray Body */}
      <AnimatePresence>
        {showProductTray && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-[2rem] p-4 shadow-2xl border border-white/40"
          >
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#a67c52]" />
                <p>Cargando muebles en 3D...</p>
              </div>
            ) : (
              <div
                className="flex overflow-x-auto gap-4 pb-2 px-2 snap-x snap-mandatory hide-scrollbars"
                style={{ scrollbarWidth: "none" }}
              >
                {products.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToRoom(p)}
                    className="snap-start shrink-0 w-32 md:w-36 flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="aspect-square relative bg-[#f9f8f6] p-2 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/no-image.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-[#a67c52]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-[#a67c52] text-white p-2 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                          <Box className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <p
                        className="text-xs font-semibold text-[#3a2f22] line-clamp-1"
                        title={p.name}
                      >
                        {p.name}
                      </p>
                      <p className="text-xs font-bold text-[#a67c52] mt-0.5">
                        {p.price}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
