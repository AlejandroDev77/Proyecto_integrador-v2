import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface MueblesMaterialesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  onSortChange: (sort: string) => void;
}

export const MueblesMaterialesAdvancedFilters: React.FC<MueblesMaterialesFiltersProps> = ({
  onFiltersChange,
  onSortChange,
}) => {

  const filterFields = [
    {
      id: 'cod_mue_mat',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: MMT-1',
    },
    {
      id: 'nom_mue',
      label: 'Nombre Mueble',
      type: 'text' as const,
      placeholder: 'Ej: Silla, Mesa',
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
      placeholder: 'Ej: 5000',
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
      placeholder: 'Ej: 2500',
    },
    {
      id: 'stock_mue_min',
      label: 'Stock Mueble Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 1',
    },
    {
      id: 'stock_mue_max',
      label: 'Stock Mueble Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 100',
    },
    {
      id: 'nom_mat',
      label: 'Nombre Material',
      type: 'text' as const,
      placeholder: 'Ej: Madera, Acero',
    },
    {
      id: 'stock_mat_min',
      label: 'Stock Material Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 10',
    },
    {
      id: 'stock_mat_max',
      label: 'Stock Material Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 1000',
    },
    {
      id: 'costo_mat_min',
      label: 'Costo Material Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 50',
    },
    {
      id: 'costo_mat_max',
      label: 'Costo Material Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 500',
    },
    {
      id: 'unidad_medida',
      label: 'Unidad Medida',
      type: 'text' as const,
      placeholder: 'Ej: kg, m, unidad',
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
  ];

  const handleFiltersChange = (filters: Record<string, any>) => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    onSortChange('');
  };

  return (
    <div className="space-y-4">
      <AdvancedFilters
        fields={filterFields}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />
    </div>
  );
};

export default MueblesMaterialesAdvancedFilters;
