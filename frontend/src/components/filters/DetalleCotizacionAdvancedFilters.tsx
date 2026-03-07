import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface DetalleCotizacionFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const DetalleCotizacionAdvancedFilters: React.FC<
  DetalleCotizacionFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_det_cot",
      label: "Código Detalle",
      type: "text" as const,
      placeholder: "Ej: DTC-1",
    },
    {
      id: "cantidad_min",
      label: "Cantidad Mínima",
      type: "number" as const,
      placeholder: "Ej: 1",
    },
    {
      id: "cantidad_max",
      label: "Cantidad Máxima",
      type: "number" as const,
      placeholder: "Ej: 100",
    },
    {
      id: "precio_unitario_min",
      label: "Precio Unitario Mín.",
      type: "number" as const,
      placeholder: "Ej: 100",
    },
    {
      id: "precio_unitario_max",
      label: "Precio Unitario Máx.",
      type: "number" as const,
      placeholder: "Ej: 5000",
    },
  ];

  const handleFiltersChange = (filters: Record<string, any>) => {
    onFiltersChange(filters);
  };

  return (
    <div className="space-y-4">
      <AdvancedFilters
        fields={filterFields}
        onFiltersChange={handleFiltersChange}
        onReset={() => onFiltersChange({})}
      />
    </div>
  );
};

export default DetalleCotizacionAdvancedFilters;
