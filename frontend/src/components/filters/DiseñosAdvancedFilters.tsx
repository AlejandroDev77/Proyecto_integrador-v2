import React from "react";
import AdvancedFilters from "./AdvancedFilters";

interface DiseñosAdvancedFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const DiseñosAdvancedFilters: React.FC<DiseñosAdvancedFiltersProps> = ({
  onFiltersChange,
}) => {
  const filterFields = [
    {
      id: "cod_dis",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: DIS-1",
    },
    {
      id: "nom_dis",
      label: "Nombre",
      type: "text" as const,
      placeholder: "Buscar por nombre...",
    },
    {
      id: "desc_dis",
      label: "Descripción",
      type: "text" as const,
      placeholder: "Buscar en descripción...",
    },
  ];

  return (
    <AdvancedFilters fields={filterFields} onFiltersChange={onFiltersChange} />
  );
};

export default DiseñosAdvancedFilters;
