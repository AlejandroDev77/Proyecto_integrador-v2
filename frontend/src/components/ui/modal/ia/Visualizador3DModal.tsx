import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { X, Maximize, Minimize, Box, RotateCcw } from "lucide-react";
import ModelEnhanced from "../../../Diseño3D/Model/ModelEnhanced";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  title: string;
}

export default function Visualizador3DModal({ isOpen, onClose, modelUrl, title }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const orbitControlsRef = useRef<any>(null);

  if (!isOpen) return null;

  const resetView = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen ? "w-full h-full" : "w-full max-w-4xl h-[80vh]"
      }`}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <Box size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-xs text-gray-500">Visualizador 3D IA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900">
          <Suspense fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 animate-pulse">Cargando modelo 3D...</p>
            </div>
          }>
            <Canvas camera={{ position: [3, 3, 3], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
              <Environment preset="studio" />
              <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={10} blur={2} />
              
              <ModelEnhanced 
                url={modelUrl} 
                onPartClick={() => {}}
                reset={false}
                makeWhite={false}
                showWireframe={false}
                showDimensions={false}
                showGrid={true}
                showAxes={false}
                autoRotate={autoRotate}
                rotationSpeed={1}
                selectedPart={null}
              />

              <OrbitControls 
                ref={orbitControlsRef}
                enableDamping={true}
                dampingFactor={0.05}
                makeDefault
              />
            </Canvas>
          </Suspense>

          {/* Floating Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border dark:border-gray-700">
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg transition-colors ${autoRotate ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              title="Auto Rotación"
            >
              <RotateCcw size={20} className={autoRotate ? "animate-spin-slow" : ""} />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
            <button 
              onClick={resetView}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Resetear Cámara"
            >
              <Box size={20} />
            </button>
          </div>
        </div>
        
        {/* Help text */}
        <div className="px-6 py-2 bg-white dark:bg-gray-900 border-t dark:border-gray-800 text-[10px] text-gray-400 text-center">
          Usa el ratón para rotar • Scroll para zoom • Click derecho para desplazar
        </div>
      </div>
    </div>
  );
}
