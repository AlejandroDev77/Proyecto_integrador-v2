import type { RefObject } from "react";
import {
  Settings,
  RotateCcw,
  Palette,
  Save,
  Undo2,
  Download,
} from "lucide-react";
import * as THREE from "three";

type Props = {
  resetModel: () => void;
  makeModelWhite: () => void;
  saveCopy: () => void | Promise<void>;
  resetDesignChanges: () => void;
  modelUrl: string | null;
  sceneRef: RefObject<THREE.Group | null>;
  selectedPart: THREE.Mesh | null;
  onUndo?: () => void;
  canUndo?: boolean;
};

export default function ActionsCardEnhanced({
  resetModel,
  makeModelWhite,
  saveCopy,
  resetDesignChanges,
  modelUrl,
  sceneRef,
  selectedPart,
  onUndo,
  canUndo,
}: Props) {
  const actions = [
    {
      id: "reset",
      label: "Restablecer Todo",
      icon: <RotateCcw className="w-4 h-4" />,
      onClick: resetModel,
      disabled: !modelUrl,
      variant: "primary",
    },
    {
      id: "white",
      label: "Hacer Blanco",
      icon: <Palette className="w-4 h-4" />,
      onClick: makeModelWhite,
      disabled: !modelUrl,
      variant: "secondary",
    },
    {
      id: "save",
      label: "Guardar Copia",
      icon: <Save className="w-4 h-4" />,
      onClick: saveCopy,
      disabled: !modelUrl || !sceneRef.current,
      variant: "success",
    },
    {
      id: "reset-part",
      label: "Reset Parte",
      icon: <Undo2 className="w-4 h-4" />,
      onClick: resetDesignChanges,
      disabled: !selectedPart,
      variant: "warning",
    },
  ];

  const getVariantClasses = (variant: string, disabled: boolean) => {
    if (disabled) {
      return "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed";
    }
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25";
      case "secondary":
        return "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white";
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25";
      case "warning":
        return "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-white">Acciones</h3>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${getVariantClasses(
              action.variant,
              action.disabled
            )}`}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}

        {/* Undo Button */}
        {onUndo && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-3">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                canUndo
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Undo2 className="w-4 h-4" />
              Deshacer última acción
            </button>
          </div>
        )}

        {/* Export Options */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Exportar
          </p>
          <div className="flex gap-2">
            <button
              disabled={!modelUrl}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3 h-3" />
              GLB
            </button>
            <button
              disabled={!modelUrl}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3 h-3" />
              OBJ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
