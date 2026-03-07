import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";

type Props = {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomLevel?: number;
  onFitView?: () => void;
  onResetView?: () => void;
};

export default function ZoomControlsEnhanced({
  zoomIn,
  zoomOut,
  zoomLevel = 100,
  onFitView,
  onResetView,
}: Props) {
  return (
    <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-2">
      {/* Zoom Level Indicator */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-1.5 text-center">
        <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-200">
          {Math.round(zoomLevel)}%
        </span>
      </div>

      {/* Control Buttons */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-1.5 flex flex-col gap-1">
        <button
          onClick={zoomIn}
          className="w-10 h-10 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-200"
          title="Acercar"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <button
          onClick={zoomOut}
          className="w-10 h-10 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-200"
          title="Alejar"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <div className="border-t border-gray-200 dark:border-gray-600 my-1" />

        {onFitView && (
          <button
            onClick={onFitView}
            className="w-10 h-10 rounded-lg bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center transition-all duration-200 hover:scale-105 text-blue-600 dark:text-blue-400"
            title="Ajustar a vista"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}

        {onResetView && (
          <button
            onClick={onResetView}
            className="w-10 h-10 rounded-lg bg-transparent hover:bg-orange-50 dark:hover:bg-orange-900/30 flex items-center justify-center transition-all duration-200 hover:scale-105 text-orange-600 dark:text-orange-400"
            title="Restablecer vista"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
