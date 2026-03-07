import React, { useState } from "react";
import {
  X,
  Eye,
  DollarSign,
  Calculator,
  FileSearch,
  Package,
} from "lucide-react";

interface CostoCotizacion {
  id_costo: number;
  id_cot: number;
  costo_materiales?: number;
  costo_mano_obra?: number;
  costos_indirectos?: number;
  margen_ganancia?: number;
  costo_total?: number;
  precio_sugerido?: number;
  cotizacion?: { cod_cot?: string; fec_cot?: string };
}

interface ModalVerCostoCotizacionProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  costoCotizacionSeleccionado: CostoCotizacion | null;
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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

const ModalVerCostoCotizacion: React.FC<ModalVerCostoCotizacionProps> = ({
  showModal,
  setShowModal,
  costoCotizacionSeleccionado,
}) => {
  const [activeTab, setActiveTab] = useState<"DETALLES" | "RESUMEN">(
    "DETALLES"
  );

  if (!showModal || !costoCotizacionSeleccionado) return null;

  const c = costoCotizacionSeleccionado;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            Detalles del Costo
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-white">
          {(["DETALLES", "RESUMEN"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 sm:px-6 py-4 font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 border-b-2 ${
                activeTab === tab
                  ? "text-blue-600 border-blue-600 bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 border-transparent"
              }`}
            >
              {tab === "DETALLES" && <DollarSign className="w-5 h-5" />}
              {tab === "RESUMEN" && <Calculator className="w-5 h-5" />}
              <span className="hidden sm:inline">
                {tab === "DETALLES" ? "Desglose" : "Resumen"}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          {activeTab === "DETALLES" && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <FileSearch className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cotización
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {c.cotizacion?.cod_cot || `COT-${c.id_cot}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DetailItem
                  label="Costo Materiales"
                  value={`${Number(c.costo_materiales || 0).toFixed(2)} Bs`}
                  icon={<Package className="w-5 h-5 text-blue-600" />}
                />
                <DetailItem
                  label="Costo Mano de Obra"
                  value={`${Number(c.costo_mano_obra || 0).toFixed(2)} Bs`}
                  icon={<DollarSign className="w-5 h-5 text-green-600" />}
                />
                <DetailItem
                  label="Costos Indirectos"
                  value={`${Number(c.costos_indirectos || 0).toFixed(2)} Bs`}
                  icon={<DollarSign className="w-5 h-5 text-orange-600" />}
                />
                <DetailItem
                  label="Margen de Ganancia"
                  value={`${Number(c.margen_ganancia || 0).toFixed(1)}%`}
                  icon={<Calculator className="w-5 h-5 text-purple-600" />}
                />
              </div>
            </div>
          )}

          {activeTab === "RESUMEN" && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Resumen de Costos
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Costo Materiales</span>
                    <span className="font-medium">
                      {Number(c.costo_materiales || 0).toFixed(2)} Bs
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Costo Mano de Obra</span>
                    <span className="font-medium">
                      {Number(c.costo_mano_obra || 0).toFixed(2)} Bs
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Costos Indirectos</span>
                    <span className="font-medium">
                      {Number(c.costos_indirectos || 0).toFixed(2)} Bs
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b-2 border-gray-300 font-semibold">
                    <span>Costo Total</span>
                    <span>{Number(c.costo_total || 0).toFixed(2)} Bs</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm text-gray-500">
                    <span>Margen de Ganancia</span>
                    <span>+ {Number(c.margen_ganancia || 0).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Precio Sugerido
                    </p>
                    <p className="text-xs text-gray-500">
                      (Costo Total + Margen)
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {Number(c.precio_sugerido || 0).toFixed(2)} Bs
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 sm:px-8 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 sm:px-8 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
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

export default ModalVerCostoCotizacion;
