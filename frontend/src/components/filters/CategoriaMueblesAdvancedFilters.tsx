import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface CategoriaMueblesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const CategoriaMueblesAdvancedFilters: React.FC<
  CategoriaMueblesFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_cat",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: CAT-1",
    },
    {
      id: "nom_cat",
      label: "Nombre",
      type: "text" as const,
      placeholder: "Ej: Sillas",
    },
    {
      id: "desc_cat",
      label: "Descripción",
      type: "text" as const,
      placeholder: "Ej: Categoría de sillas",
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

export default CategoriaMueblesAdvancedFilters;
