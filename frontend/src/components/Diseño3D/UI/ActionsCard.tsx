import type { RefObject } from "react";
import { Settings } from "lucide-react";
import * as THREE from "three";

type Props = {
  resetModel: () => void;
  makeModelWhite: () => void;
  saveCopy: () => void | Promise<void>;
  resetDesignChanges: () => void;
  modelUrl: string | null;
  sceneRef: RefObject<THREE.Group | null>;
  selectedPart: THREE.Mesh | null;
};

export default function ActionsCard({
  resetModel,
  makeModelWhite,
  saveCopy,
  resetDesignChanges,
  modelUrl,
  sceneRef,
  selectedPart,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
          Acciones
        </h3>
      </div>
      <div className="space-y-2">
        <button
          onClick={resetModel}
          className="w-full px-4 py-2.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium shadow-sm"
        >
          ↻ Restablecer Todo
        </button>
        <button
          onClick={makeModelWhite}
          className="w-full px-4 py-2.5 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors font-medium shadow-sm"
        >
          ◻ Hacer Blanco
        </button>
        <button
          onClick={() => saveCopy()}
          disabled={!modelUrl || !sceneRef.current}
          className="w-full px-4 py-2.5 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Guardar copia sin modificar el original"
        >
          Guardar copia
        </button>
        <button
          onClick={resetDesignChanges}
          disabled={!selectedPart}
          className="w-full px-4 py-2.5 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⟲ Reset Parte
        </button>
      </div>
    </div>
  );
}
