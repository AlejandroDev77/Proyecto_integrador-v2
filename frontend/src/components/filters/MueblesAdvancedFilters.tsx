import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface MueblesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const MueblesAdvancedFilters: React.FC<MueblesFiltersProps> = ({
  onFiltersChange,
}) => {
  const filterFields = [
    {
      id: 'cod_mue',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: MUE-1',
    },
    {
      id: 'nom_mue',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Silla madera',
    },
    {
      id: 'desc_mue',
      label: 'Descripción',
      type: 'text' as const,
      placeholder: 'Ej: Madera de pino',
    },
    {
      id: 'precio_venta_min',
      label: 'Precio Venta Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 100',
    },
    {
      id: 'precio_venta_max',
      label: 'Precio Venta Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 10000',
    },
    {
      id: 'precio_costo_min',
      label: 'Precio Costo Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 50',
    },
    {
      id: 'precio_costo_max',
      label: 'Precio Costo Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 5000',
    },
    {
      id: 'stock_min',
      label: 'Stock Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 1',
    },
    {
      id: 'stock_max',
      label: 'Stock Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 1000',
    },
    {
      id: 'nom_cat',
      label: 'Búsqueda (Categoría)',
      type: 'text' as const,
      placeholder: 'Ej: Sillas',
    },
    {
      id: 'est_mue',
      label: 'Estado',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Disponible' },
        { value: 'false', label: 'No Disponible' },
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

export default MueblesAdvancedFilters;
