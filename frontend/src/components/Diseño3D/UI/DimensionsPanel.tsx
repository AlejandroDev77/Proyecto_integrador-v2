import { Ruler } from "lucide-react";
import * as THREE from "three";

type Props = {
  selectedPart: THREE.Mesh | null;
  visible: boolean;
  onClose: () => void;
  dimensions: { width: number; height: number; depth: number };
  updateDimensions: (
    dimension: "width" | "height" | "depth",
    value: number
  ) => void;
  onUndo: () => any | undefined;
  canUndo: boolean;
  setDimensions: (d: { width: number; height: number; depth: number }) => void;
};

export default function DimensionsPanel({
  selectedPart,
  visible,
  onClose,
  dimensions,
  updateDimensions,
  onUndo,
  canUndo,
  setDimensions,
}: Props) {
  if (!visible || !selectedPart) return null;

  return (
    <div className="absolute top-4 right-4 z-30 w-96">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
        <button
          onClick={onClose}
          title="Cerrar"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 flex items-center justify-center text-gray-700 dark:text-gray-200"
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
          <Ruler className="w-6 h-6 text-blue-500 dark:text-blue-300" />
          Ajustar Dimensiones
        </h3>

        <div className="flex justify-end mb-3">
          <button
            onClick={() => {
              const entry = onUndo();
              if (entry) {
                const { part, prev } = entry;
                if (
                  part &&
                  part.material &&
                  part.material instanceof THREE.MeshStandardMaterial
                ) {
                  const mat = part.material as THREE.MeshStandardMaterial;
                  if (prev.color !== undefined) mat.color.setHex(prev.color);
                  mat.map = prev.map;
                  mat.flatShading = !!prev.flatShading;
                  mat.needsUpdate = true;
                  part.scale.set(prev.scale.x, prev.scale.y, prev.scale.z);
                  if (part === selectedPart) {
                    setDimensions({
                      width: part.scale.x * 100,
                      height: part.scale.y * 100,
                      depth: part.scale.z * 100,
                    });
                  }
                }
              }
            }}
            disabled={!canUndo}
            className="px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↶ Deshacer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              Ancho
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="500"
                value={dimensions.width}
                onChange={(e) =>
                  updateDimensions("width", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm font-semibold w-20 text-right text-gray-800 dark:text-gray-200">
                {dimensions.width.toFixed(1)} cm
              </span>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              Alto
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="500"
                value={dimensions.height}
                onChange={(e) =>
                  updateDimensions("height", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm font-semibold w-20 text-right text-gray-800 dark:text-gray-200">
                {dimensions.height.toFixed(1)} cm
              </span>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              Profundidad
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="500"
                value={dimensions.depth}
                onChange={(e) =>
                  updateDimensions("depth", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm font-semibold w-20 text-right text-gray-800 dark:text-gray-200">
                {dimensions.depth.toFixed(1)} cm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
