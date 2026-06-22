import { Suspense, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Center } from "@react-three/drei";
import { X, Maximize2, Minimize2, RefreshCw, RotateCcw, Grid3x3, Loader2, Download } from "lucide-react";
import ModelEnhanced from "../../../Diseño3D/Model/ModelEnhanced";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  title: string;
}

// ── Botón de control flotante ─────────────────────────────────────────────────
function ToolBtn({ onClick, title, active, children }: {
  onClick: () => void; title: string; active?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
        active
          ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.07] hover:text-gray-700 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function Visualizador3DModal({ isOpen, onClose, modelUrl, title }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate]     = useState(false);
  const [showGrid, setShowGrid]         = useState(false);
  const [canvasKey, setCanvasKey]       = useState(0);

  const orbitRef = useRef<any>(null);

  const handleDownload = async () => {
    if (!modelUrl) return;
    try {
      const response = await fetch(modelUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      const safeTitle = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'modelo_3d';
      a.download = `${safeTitle}.glb`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al descargar el modelo:", error);
    }
  };

  const resetCamera = useCallback(() => orbitRef.current?.reset(), []);

  // Desmontar todo cuando no está abierto.
  // Esto libera el Canvas de React Three Fiber y elimina el div bloqueante.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className={`relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.07] bg-white dark:bg-gray-900 shadow-2xl transition-[width,height] duration-300 ${
          isFullscreen ? "w-full h-full" : "w-full max-w-4xl h-[82vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/[0.05] flex-shrink-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{title}</p>
          <div className="flex items-center gap-1 ml-3">
            <ToolBtn onClick={handleDownload} title="Descargar modelo .GLB">
              <Download size={15} />
            </ToolBtn>
            <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />
            <ToolBtn
              onClick={() => setIsFullscreen((f) => !f)}
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </ToolBtn>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="relative flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950/40">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <Loader2 size={26} className="text-orange-400 animate-spin" />
                <p className="text-xs text-gray-400">Cargando modelo...</p>
              </div>
            }
          >
            <Canvas
              key={`viewer-canvas-${canvasKey}`} // Cambiar key fuerza el desmontaje y montaje
              onCreated={({ gl }) => {
                // Manejar la pérdida de contexto para recargar automáticamente el canvas
                gl.domElement.addEventListener("webglcontextlost", (e) => {
                  e.preventDefault();
                  console.warn("Contexto WebGL perdido, recargando Canvas...");
                  setCanvasKey((prev) => prev + 1);
                });
              }}
              camera={{ position: [3, 2.5, 3], fov: 45 }}
              gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
              frameloop="demand"
              style={{ width: "100%", height: "100%" }}
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[8, 10, 6]} intensity={1.2} castShadow />
              <directionalLight position={[-5, 4, -4]} intensity={0.3} color="#c7d9ff" />
              <Environment preset="apartment" />
              <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={12} blur={2.5} />

              <Center>
                {modelUrl && (
                  <ModelEnhanced
                    key={modelUrl}
                    url={modelUrl}
                    onPartClick={() => {}}
                    reset={false}
                    makeWhite={false}
                    showWireframe={false}
                    showDimensions={false}
                    showGrid={showGrid}
                    showAxes={false}
                    autoRotate={autoRotate}
                    rotationSpeed={0.6}
                    selectedPart={null}
                  />
                )}
              </Center>

              <OrbitControls
                ref={orbitRef}
                enableDamping
                dampingFactor={0.06}
                minDistance={1}
                maxDistance={20}
                makeDefault
              />
            </Canvas>
          </Suspense>

          {/* Controles flotantes */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 py-1.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-white/[0.07] shadow-lg">
            <ToolBtn onClick={resetCamera} title="Resetear cámara">
              <RotateCcw size={14} />
            </ToolBtn>
            <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />
            <ToolBtn
              onClick={() => setAutoRotate((r) => !r)}
              title="Rotación automática"
              active={autoRotate}
            >
              <RefreshCw size={14} className={autoRotate ? "animate-spin" : ""} />
            </ToolBtn>
            <ToolBtn
              onClick={() => setShowGrid((g) => !g)}
              title="Grilla"
              active={showGrid}
            >
              <Grid3x3 size={14} />
            </ToolBtn>
          </div>

          {/* Hint */}
          <p className="absolute top-2 right-3 text-[10px] text-gray-400 dark:text-gray-600 text-right leading-relaxed select-none pointer-events-none">
            Arrastra — Rotar &nbsp;·&nbsp; Scroll — Zoom
          </p>
        </div>
      </motion.div>
    </div>
  );
}
