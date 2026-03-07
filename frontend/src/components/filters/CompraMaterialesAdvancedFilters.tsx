import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface CompraMaterialesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const CompraMaterialesAdvancedFilters: React.FC<CompraMaterialesFiltersProps> = ({
  onFiltersChange,
}) => {
  const filterFields = [
    {
      id: 'cod_comp',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: COMP-1',
    },
    {
      id: 'fec_comp_exact',
      label: 'Fecha Exacta',
      type: 'date' as const,
    },
    {
      id: 'fec_comp_min',
      label: 'Fecha Desde',
      type: 'date' as const,
    },
    {
      id: 'fec_comp_max',
      label: 'Fecha Hasta',
      type: 'date' as const,
    },
    {
      id: 'total_comp_min',
      label: 'Monto Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 1000',
    },
    {
      id: 'total_comp_max',
      label: 'Monto Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 100000',
    },
    {
      id: 'est_comp',
      label: 'Estado',
      type: 'select' as const,
      options: [
        { value: 'completada', label: 'Completada' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'cancelada', label: 'Cancelada' },
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

export default CompraMaterialesAdvancedFilters;
