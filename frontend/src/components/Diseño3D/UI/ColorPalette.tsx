import { useState } from "react";
import { Palette, History, Pipette } from "lucide-react";
import * as THREE from "three";

type Props = {
  selectedPart: THREE.Mesh | null;
  onChangeColor: (color: string) => void;
};

const PRESET_COLORS = [
  // Material Design Colors
  { name: "Rojo", hex: "#EF4444" },
  { name: "Naranja", hex: "#F97316" },
  { name: "Ámbar", hex: "#F59E0B" },
  { name: "Amarillo", hex: "#EAB308" },
  { name: "Lima", hex: "#84CC16" },
  { name: "Verde", hex: "#22C55E" },
  { name: "Esmeralda", hex: "#10B981" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Celeste", hex: "#0EA5E9" },
  { name: "Azul", hex: "#3B82F6" },
  { name: "Índigo", hex: "#6366F1" },
  { name: "Violeta", hex: "#8B5CF6" },
  { name: "Púrpura", hex: "#A855F7" },
  { name: "Fucsia", hex: "#D946EF" },
  { name: "Rosa", hex: "#EC4899" },
  // Neutrals
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Gris Claro", hex: "#D1D5DB" },
  { name: "Gris", hex: "#6B7280" },
  { name: "Gris Oscuro", hex: "#374151" },
];

export default function ColorPalette({ selectedPart, onChangeColor }: Props) {
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState("#3B82F6");
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    onChangeColor(color);

    // Add to history (max 5)
    setColorHistory((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 5);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-white">Color</h3>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Current Color Preview */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg shadow-inner border-2 border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Color Actual
            </p>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {currentColor.toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={`p-2 rounded-lg transition-colors ${
              showPicker
                ? "bg-purple-100 dark:bg-purple-900 text-purple-600"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
            title="Selector de color"
          >
            <Pipette className="w-5 h-5" />
          </button>
        </div>

        {/* Color Picker */}
        {showPicker && (
          <div className="animate-fade-in">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              disabled={!selectedPart}
              className="w-full h-14 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* Preset Colors Grid */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Colores Rápidos
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleColorChange(color.hex)}
                disabled={!selectedPart}
                className="w-6 h-6 rounded-md shadow-sm hover:scale-125 transition-transform disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Color History */}
        {colorHistory.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <History className="w-3 h-3" />
              Recientes
            </p>
            <div className="flex gap-2">
              {colorHistory.map((color, i) => (
                <button
                  key={`${color}-${i}`}
                  onClick={() => handleColorChange(color)}
                  disabled={!selectedPart}
                  className="w-8 h-8 rounded-lg shadow hover:scale-110 transition-transform disabled:opacity-50 border-2 border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <p
          className={`text-xs text-center py-2 rounded-lg ${
            selectedPart
              ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          }`}
        >
          {selectedPart ? "✓ Parte seleccionada" : "Haz clic en el modelo"}
        </p>
      </div>
    </div>
  );
}
