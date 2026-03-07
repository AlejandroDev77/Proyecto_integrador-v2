import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface DetallesProduccionFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const DetallesProduccionAdvancedFilters: React.FC<
  DetallesProduccionFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_det_prod",
      label: "Código Detalle",
      type: "text" as const,
      placeholder: "Ej: DTP-1",
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

export default DetallesProduccionAdvancedFilters;
