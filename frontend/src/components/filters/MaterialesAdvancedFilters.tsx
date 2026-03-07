import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface MaterialesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const MaterialesAdvancedFilters: React.FC<MaterialesFiltersProps> = ({
  onFiltersChange,
}) => {
  const filterFields = [
    {
      id: 'cod_mat',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: MAT-1',
    },
    {
      id: 'nom_mat',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Madera',
    },
    {
      id: 'desc_mat',
      label: 'Descripción',
      type: 'text' as const,
      placeholder: 'Ej: Madera de roble',
    },
    {
      id: 'stock_mat_min',
      label: 'Stock Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 1',
    },
    {
      id: 'stock_mat_max',
      label: 'Stock Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 1000',
    },
    {
      id: 'costo_mat_min',
      label: 'Costo Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 50',
    },
    {
      id: 'costo_mat_max',
      label: 'Costo Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 5000',
    },
    {
      id: 'unidad_medida',
      label: 'Unidad de Medida',
      type: 'text' as const,
      placeholder: 'Ej: kg, m, unidad',
    },
    {
      id: 'est_mat',
      label: 'Estado',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
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

export default MaterialesAdvancedFilters;
