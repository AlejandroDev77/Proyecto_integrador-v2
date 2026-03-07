import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface ProduccionesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const ProduccionesAdvancedFilters: React.FC<
  ProduccionesFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_pro",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: POD-1",
    },
    {
      id: "fec_ini_exact",
      label: "Fecha Inicio (Exacta)",
      type: "date" as const,
    },
    {
      id: "fec_ini_min",
      label: "Fecha Inicio (Desde)",
      type: "date" as const,
    },
    {
      id: "fec_ini_max",
      label: "Fecha Inicio (Hasta)",
      type: "date" as const,
    },
    {
      id: "fec_fin_exact",
      label: "Fecha Fin (Exacta)",
      type: "date" as const,
    },
    {
      id: "fec_fin_min",
      label: "Fecha Fin (Desde)",
      type: "date" as const,
    },
    {
      id: "fec_fin_max",
      label: "Fecha Fin (Hasta)",
      type: "date" as const,
    },
    {
      id: "est_pro",
      label: "Estado",
      type: "select" as const,
      options: [
        { value: "iniciada", label: "Iniciada" },
        { value: "en_proceso", label: "En Proceso" },
        { value: "finalizada", label: "Finalizada" },
        { value: "cancelada", label: "Cancelada" },
      ],
    },
    {
      id: "prioridad",
      label: "Prioridad",
      type: "select" as const,
      options: [
        { value: "baja", label: "Baja" },
        { value: "media", label: "Media" },
        { value: "alta", label: "Alta" },
        { value: "urgente", label: "Urgente" },
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

export default ProduccionesAdvancedFilters;
