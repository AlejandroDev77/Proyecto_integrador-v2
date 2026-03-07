import React from "react";

interface DetailItemProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Componente reutilizable para mostrar un campo de detalle en modales VerDatos.
 * Soporta modo claro y oscuro.
 */
export function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export default DetailItem;
