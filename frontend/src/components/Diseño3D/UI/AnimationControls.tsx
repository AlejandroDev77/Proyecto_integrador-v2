import { RotateCw, Play, Pause, Gauge } from "lucide-react";

type Props = {
  autoRotate: boolean;
  rotationSpeed: number;
  onToggleAutoRotate: () => void;
  onSpeedChange: (speed: number) => void;
};

export default function AnimationControls({
  autoRotate,
  rotationSpeed,
  onToggleAutoRotate,
  onSpeedChange,
}: Props) {
  const speedPresets = [
    { label: "Lento", value: 0.5 },
    { label: "Normal", value: 1 },
    { label: "Rápido", value: 2 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <RotateCw
              className={`w-5 h-5 text-white ${
                autoRotate ? "animate-spin" : ""
              }`}
            />
          </div>
          <h3 className="font-bold text-lg text-white">Animación</h3>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Auto Rotate Toggle */}
        <button
          onClick={onToggleAutoRotate}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            autoRotate
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {autoRotate ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Detener Rotación</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Auto-Rotar</span>
            </>
          )}
        </button>

        {/* Speed Control */}
        <div
          className={`space-y-3 transition-opacity ${
            autoRotate ? "opacity-100" : "opacity-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Velocidad
            </span>
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {rotationSpeed.toFixed(1)}x
            </span>
          </div>

          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={rotationSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            disabled={!autoRotate}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-500"
          />

          {/* Speed Presets */}
          <div className="flex gap-2">
            {speedPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onSpeedChange(preset.value)}
                disabled={!autoRotate}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  Math.abs(rotationSpeed - preset.value) < 0.05
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Turntable Mode Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
          Modo presentación: ideal para mostrar modelos
        </div>
      </div>
    </div>
  );
}
