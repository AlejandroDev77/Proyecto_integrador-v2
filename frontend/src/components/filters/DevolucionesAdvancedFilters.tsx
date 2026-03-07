import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface DevolucionesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const DevolucionesAdvancedFilters: React.FC<
  DevolucionesFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_dev",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: DEV-1",
    },
    {
      id: "motivo_dev",
      label: "Motivo",
      type: "text" as const,
      placeholder: "Ej: Producto defectuoso",
    },
    {
      id: "fec_dev_exact",
      label: "Fecha Exacta",
      type: "date" as const,
    },
    {
      id: "fec_dev_min",
      label: "Fecha Desde",
      type: "date" as const,
    },
    {
      id: "fec_dev_max",
      label: "Fecha Hasta",
      type: "date" as const,
    },
    {
      id: "total_dev_min",
      label: "Monto Mínimo",
      type: "number" as const,
      placeholder: "Ej: 1000",
    },
    {
      id: "total_dev_max",
      label: "Monto Máximo",
      type: "number" as const,
      placeholder: "Ej: 100000",
    },
    {
      id: "est_dev",
      label: "Estado",
      type: "select" as const,
      options: [
        { value: "completada", label: "Completada" },
        { value: "pendiente", label: "Pendiente" },
        { value: "cancelada", label: "Cancelada" },
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

export default DevolucionesAdvancedFilters;
