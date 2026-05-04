import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, GripHorizontal, Settings2, View, ChevronUp } from "lucide-react";
import { ViewMode } from "./types";

interface BottomControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onClear: () => void;
}

export function BottomControls({ viewMode, setViewMode, onClear }: BottomControlsProps) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const isSideView = viewMode.startsWith("side");
  
  // Ref to handle clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSideMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center p-1 relative">
        <button
          onClick={() => { setViewMode("isometric"); setSideMenuOpen(false); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            viewMode === "isometric"
              ? "bg-[#f5f5f5] text-[#111]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Box className="w-4 h-4" />
          Casa de muñecas
        </button>

        <button
          onClick={() => { setViewMode("top"); setSideMenuOpen(false); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            viewMode === "top"
              ? "bg-[#f5f5f5] text-[#111]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <GripHorizontal className="w-4 h-4" />
          Vista superior
        </button>

        {/* Vistas Laterales Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              if (!isSideView) setViewMode("sideFront");
              setSideMenuOpen(!sideMenuOpen);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              isSideView
                ? "bg-[#f5f5f5] text-[#111]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <View className="w-4 h-4" />
            Vistas laterales
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {sideMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-2 w-full p-2 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-1"
              >
                <button
                  onClick={() => { setViewMode("sideFront"); setSideMenuOpen(false); }}
                  className={`text-left px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-50 ${viewMode === "sideFront" ? "bg-blue-50 text-[#0058a3]" : "text-gray-700"}`}
                >
                  Frontal
                </button>
                <button
                  onClick={() => { setViewMode("sideBack"); setSideMenuOpen(false); }}
                  className={`text-left px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-50 ${viewMode === "sideBack" ? "bg-blue-50 text-[#0058a3]" : "text-gray-700"}`}
                >
                  Trasera
                </button>
                <button
                  onClick={() => { setViewMode("sideLeft"); setSideMenuOpen(false); }}
                  className={`text-left px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-50 ${viewMode === "sideLeft" ? "bg-blue-50 text-[#0058a3]" : "text-gray-700"}`}
                >
                  Izquierda
                </button>
                <button
                  onClick={() => { setViewMode("sideRight"); setSideMenuOpen(false); }}
                  className={`text-left px-4 py-2 text-sm font-medium rounded-xl hover:bg-gray-50 ${viewMode === "sideRight" ? "bg-blue-50 text-[#0058a3]" : "text-gray-700"}`}
                >
                  Derecha
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />

        <button
          onClick={onClear}
          className="p-2.5 text-gray-500 hover:bg-gray-50 hover:text-red-500 rounded-full transition-all"
          title="Limpiar habitación"
        >
          <Trash2Icon />
        </button>
      </div>
    </div>
  );
}

function Trash2Icon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
