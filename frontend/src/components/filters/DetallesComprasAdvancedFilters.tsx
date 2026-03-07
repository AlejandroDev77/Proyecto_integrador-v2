import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';


interface DetallesComprasFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  
}

export const DetallesComprasAdvancedFilters: React.FC<DetallesComprasFiltersProps> = ({
  onFiltersChange,
}) => {


  const filterFields = [
    {
      id: 'cod_det_com',
      label: 'Código Detalle',
      type: 'text' as const,
      placeholder: 'Ej: DET-1',
    },
    {
      id: 'cantidad_min',
      label: 'Cantidad Mínima',
      type: 'number' as const,
      placeholder: 'Ej: 1',
    },
    {
      id: 'cantidad_max',
      label: 'Cantidad Máxima',
      type: 'number' as const,
      placeholder: 'Ej: 100',
    },
    {
      id: 'precio_unitario_min',
      label: 'Precio Unitario Mín.',
      type: 'number' as const,
      placeholder: 'Ej: 10',
    },
    {
      id: 'precio_unitario_max',
      label: 'Precio Unitario Máx.',
      type: 'number' as const,
      placeholder: 'Ej: 500',
    },
    {
      id: 'subtotal_min',
      label: 'Subtotal Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 100',
    },
    {
      id: 'subtotal_max',
      label: 'Subtotal Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 10000',
    },
    {
      id: 'compra_fecha_desde',
      label: 'Fecha Compra Desde',
      type: 'date' as const,
    },
    {
      id: 'compra_fecha_hasta',
      label: 'Fecha Compra Hasta',
      type: 'date' as const,
    },
    {
      id: 'nom_mat',
      label: 'Nombre Material',
      type: 'text' as const,
      placeholder: 'Ej: Madera',
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

export default DetallesComprasAdvancedFilters;
