import { Image } from "lucide-react";
import * as THREE from "three";

type Props = {
  selectedPart: THREE.Mesh | null;
  applyTexture: (texture: string) => void;
};

export default function TextureCard({ selectedPart, applyTexture }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Image className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          Textura
        </h3>
      </div>
      <select
        onChange={(e) => applyTexture(e.target.value)}
        disabled={!selectedPart}
        className="w-full p-3 border-2 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:border-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Seleccionar textura</option>
        <option value="wood1">Textura 1</option>
        <option value="wood2">Textura 2</option>
        <option value="wood3">Textura 4</option>
        <option value="wood4">Textura 5</option>
      </select>
    </div>
  );
}
