import React from "react";
import AdvancedFilters from "../filters/AdvancedFilters";

interface DetalleDevolucionFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const DetalleDevolucionAdvancedFilters: React.FC<
  DetalleDevolucionFiltersProps
> = ({ onFiltersChange }) => {
  const filterFields = [
    {
      id: "cod_det_dev",
      label: "Código Detalle",
      type: "text" as const,
      placeholder: "Ej: DTV-1",
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
      label: "precio Unitario Mín.",
      type: "number" as const,
      placeholder: "Ej: 10",
    },
    {
      id: "precio_unitario_max",
      label: "precio Unitario Máx.",
      type: "number" as const,
      placeholder: "Ej: 500",
    },
    {
      id: "subtotal_min",
      label: "Subtotal Mínimo",
      type: "number" as const,
      placeholder: "Ej: 100",
    },
    {
      id: "subtotal_max",
      label: "subtotal Máximo",
      type: "number" as const,
      placeholder: "Ej: 10000",
    },
    {
      id: "devolucion_fecha_desde",
      label: "Fecha Devolución Desde",
      type: "date" as const,
    },
    {
      id: "devolucion_fecha_hasta",
      label: "Fecha Devolución Hasta",
      type: "date" as const,
    },
    {
      id: "estado_dev",
      label: "Estado Devolución",
      type: "select" as const,
      options: [
        { value: "pendiente", label: "Pendiente" },
        { value: "completado", label: "Completado" },
        { value: "cancelado", label: "cancelado" },
      ],
    }, 
    {
      id: "nom_mue",
      label: "Nombre Mueble",
      type: "text" as const,
      placeholder: "Ej: Silla",
    }
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

export default DetalleDevolucionAdvancedFilters;
