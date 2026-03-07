import React from "react";
import { X } from "lucide-react";

interface BaseVerDatosModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  title: string;
  titleIcon: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * Componente base reutilizable para modales VerDatos.
 * Incluye header con título e icono, botón de cerrar, y footer con botones.
 * Soporta modo claro y oscuro.
 */
export function BaseVerDatosModal({
  showModal,
  setShowModal,
  title,
  titleIcon,
  children,
  maxWidth = "max-w-4xl",
}: BaseVerDatosModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[95vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {titleIcon}
            {title}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-900">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 sm:px-8 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 sm:px-8 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 sm:px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BaseVerDatosModal;
