import { Image, Layers } from "lucide-react";
import * as THREE from "three";

type Props = {
  selectedPart: THREE.Mesh | null;
  applyTexture: (texture: string) => void;
};

type TextureOption = {
  id: string;
  name: string;
  category: "wood" | "metal" | "stone" | "fabric";
  preview: string;
};

const TEXTURES: TextureOption[] = [
  // Woods
  { id: "wood1", name: "Roble", category: "wood", preview: "W1" },
  { id: "wood2", name: "Nogal", category: "wood", preview: "W2" },
  { id: "wood3", name: "Cerezo", category: "wood", preview: "W3" },
  { id: "wood4", name: "Pino", category: "wood", preview: "W4" },
  // Metals
  { id: "metal1", name: "Acero", category: "metal", preview: "M1" },
  { id: "metal2", name: "Bronce", category: "metal", preview: "M2" },
  { id: "metal3", name: "Oro", category: "metal", preview: "M3" },
  // Stones
  { id: "stone1", name: "Mármol", category: "stone", preview: "S1" },
  { id: "stone2", name: "Granito", category: "stone", preview: "S2" },
  // Fabrics
  { id: "fabric1", name: "Cuero", category: "fabric", preview: "F1" },
  { id: "fabric2", name: "Tela", category: "fabric", preview: "F2" },
];

const CATEGORIES = [
  { id: "wood", name: "Madera", icon: "W" },
  { id: "metal", name: "Metal", icon: "M" },
  { id: "stone", name: "Piedra", icon: "S" },
  { id: "fabric", name: "Tela", icon: "F" },
];

export default function TextureCardEnhanced({
  selectedPart,
  applyTexture,
}: Props) {
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("wood");
  const [selectedTexture, setSelectedTexture] = React.useState<string | null>(
    null
  );

  const filteredTextures = TEXTURES.filter(
    (t) => t.category === selectedCategory
  );

  const handleTextureSelect = (textureId: string) => {
    setSelectedTexture(textureId);
    applyTexture(textureId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Image className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-white">Texturas</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-white dark:bg-gray-600 shadow text-orange-600 dark:text-orange-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Texture Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredTextures.map((texture) => (
            <button
              key={texture.id}
              onClick={() => handleTextureSelect(texture.id)}
              disabled={!selectedPart}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                selectedTexture === texture.id
                  ? "bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400"
                  : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-3xl">{texture.preview}</div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {texture.name}
              </span>
            </button>
          ))}
        </div>

        {/* Status */}
        <div
          className={`flex items-center justify-center gap-2 text-xs py-2 rounded-lg ${
            selectedPart
              ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          }`}
        >
          <Layers className="w-3 h-3" />
          {selectedPart ? "Parte seleccionada" : "Selecciona una parte"}
        </div>
      </div>
    </div>
  );
}

// Need to import React for useState
import React from "react";
