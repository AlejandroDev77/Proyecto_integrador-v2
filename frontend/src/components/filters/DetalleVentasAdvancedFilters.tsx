import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface DetalleVentasFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const DetalleVentasAdvancedFilters: React.FC<
  DetalleVentasFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_det_ven",
      label: "Código",
      type: "text" as const,
      placeholder: "Ej: DV-001",
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
    {
      id: "descuento_min",
      label: "Descuento Mín.",
      type: "number" as const,
      placeholder: "Ej: 0",
    },
    {
      id: "descuento_max",
      label: "Descuento Máx.",
      type: "number" as const,
      placeholder: "Ej: 500",
    },
    {
      id: "subtotal_min",
      label: "Subtotal Mínimo",
      type: "number" as const,
    },
    {
      id: "subtotal_max",
      label: "Subtotal Máximo",
      type: "number" as const,
    },

    
    {
      id: "fec_ven_exacta",
      label: "Fecha Venta Exacta",
      type: "date" as const,
    },
    {
      id: "fec_ven_desde",
      label: "Fecha Venta Desde",
      type: "date" as const,
    },
    {
      id: "fec_ven_hasta",
      label: "Fecha Venta Hasta",
      type: "date" as const,
    },
    {
      id: "nom_mue",
      label: "Mueble",
      type: "text" as const,
      placeholder: "Ej: Silla Moderna",
    },
    {
      id: "est_ven",
      label: "Estado Venta",
      type: "select" as const,
      options: [
        { value: "completado", label: "Completado" },
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

export default DetalleVentasAdvancedFilters;
