import {
  MoveHorizontal,
  MoveVertical,
  Move3d,
  Lock,
  Unlock,
  Undo2,
} from "lucide-react";
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

export default function DimensionsPanelEnhanced({
  selectedPart,
  visible,
  onClose,
  dimensions,
  updateDimensions,
  onUndo,
  canUndo,
  setDimensions,
}: Props) {
  const [lockAspectRatio, setLockAspectRatio] = React.useState(false);
  const aspectRatioRef = React.useRef({ wh: 1, wd: 1, hd: 1 });

  React.useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0 && dimensions.depth > 0) {
      aspectRatioRef.current = {
        wh: dimensions.width / dimensions.height,
        wd: dimensions.width / dimensions.depth,
        hd: dimensions.height / dimensions.depth,
      };
    }
  }, [selectedPart]);

  if (!visible || !selectedPart) return null;

  const handleDimensionChange = (
    dimension: "width" | "height" | "depth",
    value: number
  ) => {
    if (lockAspectRatio) {
      const ar = aspectRatioRef.current;
      if (dimension === "width") {
        updateDimensions("width", value);
        updateDimensions("height", value / ar.wh);
        updateDimensions("depth", value / ar.wd);
      } else if (dimension === "height") {
        updateDimensions("height", value);
        updateDimensions("width", value * ar.wh);
        updateDimensions("depth", value / ar.hd);
      } else {
        updateDimensions("depth", value);
        updateDimensions("width", value * ar.wd);
        updateDimensions("height", value * ar.hd);
      }
    } else {
      updateDimensions(dimension, value);
    }
  };

  const handleUndo = () => {
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
  };

  const dimensionConfigs = [
    {
      key: "width" as const,
      label: "Ancho",
      icon: <MoveHorizontal className="w-4 h-4" />,
      color: "blue",
      value: dimensions.width,
    },
    {
      key: "height" as const,
      label: "Alto",
      icon: <MoveVertical className="w-4 h-4" />,
      color: "green",
      value: dimensions.height,
    },
    {
      key: "depth" as const,
      label: "Profundidad",
      icon: <Move3d className="w-4 h-4" />,
      color: "purple",
      value: dimensions.depth,
    },
  ];

  return (
    <div className="absolute top-4 right-4 z-30 w-80 animate-slide-in-right">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Move3d className="w-5 h-5" />
            Dimensiones
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Deshacer"
            >
              <Undo2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-sm">✕</span>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Lock Aspect Ratio */}
          <button
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-all ${
              lockAspectRatio
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            {lockAspectRatio ? (
              <>
                <Lock className="w-4 h-4" />
                Proporciones bloqueadas
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Proporciones libres
              </>
            )}
          </button>

          {/* Dimension Controls */}
          {dimensionConfigs.map((dim) => (
            <div key={dim.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <span
                    className={`p-1 rounded bg-${dim.color}-100 dark:bg-${dim.color}-900/30 text-${dim.color}-600 dark:text-${dim.color}-400`}
                  >
                    {dim.icon}
                  </span>
                  {dim.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={dim.value.toFixed(1)}
                    onChange={(e) =>
                      handleDimensionChange(
                        dim.key,
                        parseFloat(e.target.value) || 1
                      )
                    }
                    className="w-20 px-2 py-1 text-sm text-right font-mono rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    cm
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={dim.value}
                onChange={(e) =>
                  handleDimensionChange(dim.key, parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}

          {/* Quick Presets */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Presets
            </p>
            <div className="flex gap-2">
              {[
                { label: "50%", scale: 0.5 },
                { label: "100%", scale: 1 },
                { label: "150%", scale: 1.5 },
                { label: "200%", scale: 2 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    const base = 100;
                    setDimensions({
                      width: base * preset.scale,
                      height: base * preset.scale,
                      depth: base * preset.scale,
                    });
                  }}
                  className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
