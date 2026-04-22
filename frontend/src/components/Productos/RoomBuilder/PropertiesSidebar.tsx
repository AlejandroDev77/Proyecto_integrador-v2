import { useState } from "react";
import { Palette, Box, Grid3X3, Sun, Minimize2, Maximize2, RefreshCcw, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { WALL_COLORS, FLOOR_COLORS, FLOOR_TEXTURES } from "./constants";

interface PropertiesSidebarProps {
  wallColor: any;
  setWallColor: (val: any) => void;
  floorColor: any;
  setFloorColor: (val: any) => void;
  floorTexture?: string | null;
  setFloorTexture?: (val: string | null) => void;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  hasItems: boolean;
  onClearAll: () => void;
  activeWidth: number;
  setActiveWidth: (val: number) => void;
  activeDepth: number;
  setActiveDepth: (val: number) => void;
  hasWindow: boolean;
  setHasWindow: (val: boolean) => void;
}

export function PropertiesSidebar({
  wallColor,
  setWallColor,
  floorColor,
  setFloorColor,
  floorTexture,
  setFloorTexture,
  isFullscreen,
  setIsFullscreen,
  hasItems,
  onClearAll,
  activeWidth,
  setActiveWidth,
  activeDepth,
  setActiveDepth,
  hasWindow,
  setHasWindow,
}: PropertiesSidebarProps) {
  const [activeTab, setActiveTab] = useState<"build" | "style">("style");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${isOpen ? "w-[320px]" : "w-[60px]"} relative bg-white border-l border-gray-200 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] flex flex-col h-full z-20 shrink-0 transition-all duration-300`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 -left-4 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md z-20 hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
      </button>

      {isOpen ? (
        <>
      {/* Header Actions */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-[#111] text-sm">Propiedades</h3>
        <div className="flex items-center gap-1">
          {hasItems && (
            <button
              onClick={onClearAll}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Borrar Todos los Muebles"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            title={isFullscreen ? "Minimizar" : "Pantalla Completa"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("build")}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "build" ? "text-[#0058a3] border-b-2 border-[#0058a3]" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Box className="w-4 h-4" /> Construcción
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "style" ? "text-[#0058a3] border-b-2 border-[#0058a3]" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Palette className="w-4 h-4" /> Estilo
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar">
        {activeTab === "build" ? (
          <div className="p-5 space-y-8 animate-in fade-in duration-300">
            {/* Dimensions */}
            <div>
              <h4 className="flex items-center gap-2 font-bold text-[#111] mb-4 text-sm">
                <Grid3X3 className="w-4 h-4 text-gray-400" /> Dimensiones
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                    <span>Ancho</span>
                    <span className="text-[#111]">{activeWidth} m</span>
                  </label>
                  <input
                    type="range"
                    min="2" max="30" step="0.5"
                    value={activeWidth}
                    onChange={(e) => setActiveWidth(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0058a3]"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                    <span>Profundidad</span>
                    <span className="text-[#111]">{activeDepth} m</span>
                  </label>
                  <input
                    type="range"
                    min="2" max="30" step="0.5"
                    value={activeDepth}
                    onChange={(e) => setActiveDepth(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0058a3]"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Architecture / Openings */}
            <div>
              <h4 className="flex items-center gap-2 font-bold text-[#111] mb-4 text-sm">
                <Sun className="w-4 h-4 text-gray-400" /> Luz Natural
              </h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-[#0058a3] transition-colors">
                  <input 
                    type="radio" 
                    name="window"
                    checked={!hasWindow}
                    onChange={() => setHasWindow(false)}
                    className="accent-[#0058a3] w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#111]">Pared Cerrada</div>
                    <div className="text-xs text-gray-500">Sin ventanas exteriores.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-[#0058a3] transition-colors">
                  <input 
                    type="radio" 
                    name="window"
                    checked={hasWindow}
                    onChange={() => setHasWindow(true)}
                    className="accent-[#0058a3] w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#111]">Pared Acristalada</div>
                    <div className="text-xs text-gray-500">Aumenta la iluminación exterior.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-8 animate-in fade-in duration-300">
            {/* Wall Colors */}
            <div>
              <h4 className="font-bold text-[#111] mb-3 text-sm">Pintura de Paredes</h4>
              <div className="grid grid-cols-5 gap-2">
                {WALL_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setWallColor(c)}
                    className={`w-full aspect-square rounded-full transition-transform hover:scale-110 ${
                      wallColor.name === c.name
                        ? "ring-2 ring-offset-2 ring-[#a67c52]"
                        : "border border-gray-200"
                    }`}
                    style={{ backgroundColor: c.preview }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Flooring Textures */}
            <div>
              <h4 className="font-bold text-[#111] mb-1 text-sm">Suelos de Madera</h4>
              <p className="text-xs text-gray-500 mb-3">Texturas realistas con relieve.</p>
              <div className="grid grid-cols-3 gap-2">
                {FLOOR_TEXTURES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (setFloorTexture) setFloorTexture(t.path);
                    }}
                    className={`w-full aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 ${
                      floorTexture === t.path
                        ? "ring-2 ring-offset-2 ring-[#0058a3]"
                        : "border border-gray-200"
                    }`}
                    title={t.name}
                  >
                    <img src={t.preview} alt={t.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Flooring Colors Sólidos */}
            <div>
              <h4 className="font-bold text-[#111] mb-3 text-sm">O colores sólidos:</h4>
              <div className="grid grid-cols-5 gap-2">
                {FLOOR_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setFloorColor(c);
                      if (setFloorTexture) setFloorTexture(null);
                    }}
                    className={`w-full aspect-square rounded-full transition-transform hover:scale-110 ${
                      !floorTexture && floorColor.name === c.name
                        ? "ring-2 ring-offset-2 ring-[#0058a3]"
                        : "border border-gray-200 shadow-sm"
                    }`}
                    style={{ backgroundColor: c.preview }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      ) : (
        <div className="flex-1 flex flex-col items-center pt-8">
           <Settings className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
}
