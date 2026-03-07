import { Camera, Maximize, Minimize, Grid3X3, RotateCw } from "lucide-react";

type Props = {
  onScreenshot: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
};

export default function ToolbarQuickActions({
  onScreenshot,
  isFullscreen,
  onToggleFullscreen,
  showGrid,
  onToggleGrid,
  autoRotate,
  onToggleAutoRotate,
}: Props) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl px-2 py-1.5 border border-gray-200/50 dark:border-gray-700/50">
        {/* Screenshot */}
        <button
          onClick={onScreenshot}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          title="Capturar pantalla"
        >
          <Camera className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
          <span className="text-xs font-medium hidden sm:inline">Captura</span>
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

        {/* Grid Toggle */}
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
            showGrid
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title="Mostrar grilla"
        >
          <Grid3X3 className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Grilla</span>
        </button>

        {/* Auto Rotate */}
        <button
          onClick={onToggleAutoRotate}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
            autoRotate
              ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title="Auto-rotar"
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
          <span className="text-xs font-medium hidden sm:inline">Rotar</span>
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
            isFullscreen
              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          title={
            isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
          }
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
          <span className="text-xs font-medium hidden sm:inline">
            {isFullscreen ? "Salir" : "Completa"}
          </span>
        </button>
      </div>
    </div>
  );
}
