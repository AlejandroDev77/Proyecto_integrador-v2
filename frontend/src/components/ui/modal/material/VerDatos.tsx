import React, { useState } from "react";
import { EyeIcon } from "../../../../icons";
import {
  Package,
  FileText,
  Boxes,
  Ruler,
  DollarSign,
  Image as ImageIcon,
  AlertTriangle,
  X,
} from "lucide-react";

interface ModalVerMaterialProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  materialSeleccionado: any;
}

// Componente auxiliar para mostrar detalles
function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}) {
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

// Componente para indicador de estado
function StatusBadge({ isActive }: { isActive: boolean }) {
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
          {isActive ? "Activo" : "Inactivo"}
        </span>
      </span>
    </div>
  );
}

const ModalVerMaterial: React.FC<ModalVerMaterialProps> = ({
  showModal,
  setShowModal,
  materialSeleccionado,
}) => {
  const [activeTab, setActiveTab] = useState<"DETALLES" | "IMAGEN">("DETALLES");

  if (!showModal || !materialSeleccionado) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <EyeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            Datos del Material
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {(["DETALLES", "IMAGEN"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 sm:px-6 py-4 font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 border-b-2 ${
                activeTab === tab
                  ? "text-blue-600 border-blue-600 bg-gray-50 dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent"
              }`}
            >
              {tab === "DETALLES" && <Package className="w-5 h-5" />}
              {tab === "IMAGEN" && <ImageIcon className="w-5 h-5" />}
              <span className="hidden sm:inline">
                {tab === "DETALLES" ? "Detalles" : "Imagen"}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-900">
          {activeTab === "DETALLES" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailItem
                  label="Nombre Material"
                  value={materialSeleccionado.nom_mat}
                  icon={<Package className="w-5 h-5 text-orange-600" />}
                />
                <DetailItem
                  label="Descripción"
                  value={materialSeleccionado.desc_mat || "Sin descripción"}
                  icon={<FileText className="w-5 h-5 text-blue-600" />}
                />
                <DetailItem
                  label="Stock"
                  value={String(materialSeleccionado.stock_mat)}
                  icon={<Boxes className="w-5 h-5 text-green-600" />}
                />
                <DetailItem
                  label="Stock Mínimo"
                  value={String(materialSeleccionado.stock_min)}
                  icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                />
                <DetailItem
                  label="Unidad de Medida"
                  value={materialSeleccionado.unidad_medida}
                  icon={<Ruler className="w-5 h-5 text-purple-600" />}
                />
                <DetailItem
                  label="Costo"
                  value={`${materialSeleccionado.costo_mat} Bs.`}
                  icon={<DollarSign className="w-5 h-5 text-yellow-600" />}
                />
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <StatusBadge isActive={materialSeleccionado.est_mat} />
              </div>
            </div>
          )}

          {activeTab === "IMAGEN" && (
            <div className="flex justify-center items-center w-full h-[500px]">
              {materialSeleccionado.img_mat ? (
                <img
                  src={materialSeleccionado.img_mat}
                  alt="Imagen del material"
                  className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-md object-contain hover:shadow-lg transition-shadow"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 dark:text-gray-500">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Sin imagen disponible</p>
                </div>
              )}
            </div>
          )}
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
};

export default ModalVerMaterial;
