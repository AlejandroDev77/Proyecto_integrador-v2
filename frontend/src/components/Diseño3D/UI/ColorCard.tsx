import { Palette } from "lucide-react";
import * as THREE from "three";

type Props = {
  selectedPart: THREE.Mesh | null;
  onChangeColor: (color: string) => void;
};

export default function ColorCard({ selectedPart, onChangeColor }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          Color
        </h3>
      </div>
      <div className="flex flex-col items-center gap-3">
        <input
          type="color"
          onChange={(e) => onChangeColor(e.target.value)}
          disabled={!selectedPart}
          className="w-full h-12 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-center text-gray-700 dark:text-gray-300">
          {selectedPart ? "✓ Parte seleccionada" : "Haz clic en el modelo"}
        </p>
      </div>
    </div>
  );
}
