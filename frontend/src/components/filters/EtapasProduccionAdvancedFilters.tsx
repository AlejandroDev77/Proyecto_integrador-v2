import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface EtapasProduccionFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const EtapasProduccionAdvancedFilters: React.FC<
  EtapasProduccionFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_etapa",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: ETA-1",
    },
    {
      id: "nom_eta",
      label: "Nombre",
      type: "text" as const,
      placeholder: "Ej: Corte",
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

export default EtapasProduccionAdvancedFilters;
