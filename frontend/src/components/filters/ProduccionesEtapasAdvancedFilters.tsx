import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface ProduccionesEtapasFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const ProduccionesEtapasAdvancedFilters: React.FC<
  ProduccionesEtapasFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_pro_eta",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: PET-001",
    },
    {
      id: "fec_ini",
      label: "Fecha Inicio",
      type: "date" as const,
    },
    {
      id: "fec_fin",
      label: "Fecha Fin",
      type: "date" as const,
    },
    {
      id: "est_eta",
      label: "Estado",
      type: "select" as const,
      options: [
        { value: "Pendiente", label: "Pendiente" },
        { value: "En Progreso", label: "En Progreso" },
        { value: "Completado", label: "Completado" },
        { value: "Cancelado", label: "Cancelado" },
      ],
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

export default ProduccionesEtapasAdvancedFilters;
