import React from "react";

interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}

/**
 * Componente para mostrar un indicador de estado con color.
 * Soporta modo claro y oscuro.
 */
export function StatusBadge({
  isActive,
  activeText = "Activo",
  inactiveText = "Inactivo",
}: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div
        className={`w-4 h-4 rounded-full ${
          isActive ? "bg-green-600" : "bg-red-600"
        }`}
      ></div>
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        Estado:{" "}
        <span className={isActive ? "text-green-600" : "text-red-600"}>
          {isActive ? activeText : inactiveText}
        </span>
      </span>
    </div>
  );
}

export default StatusBadge;
