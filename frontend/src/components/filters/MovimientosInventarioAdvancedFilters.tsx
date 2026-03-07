import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface MovimientosInventarioFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const MovimientosInventarioAdvancedFilters: React.FC<
  MovimientosInventarioFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_mov",
      label: "Código Movimiento",
      type: "text" as const,
      placeholder: "Ej: MOV-1",
    },
    {
      id: "tipo_mov",
      label: "Tipo",
      type: "text" as const,
      placeholder: "Ej: Entrada",
    },
    {
      id: "fecha_mov_exacta",
      label: "Fecha Exacta",
      type: "date" as const,
    },
    {
      id: "fecha_mov_desde",
      label: "Fecha Desde",
      type: "date" as const,
    },
    {
      id: "fecha_mov_hasta",
      label: "Fecha Hasta",
      type: "date" as const,
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

export default MovimientosInventarioAdvancedFilters;
