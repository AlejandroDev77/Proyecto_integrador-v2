import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface PermisosFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const PermisosAdvancedFilters: React.FC<PermisosFiltersProps> = ({
  onFiltersChange,
}) => {

  const filterFields = [
    {
      id: 'nombre',
      label: 'Nombre del Permiso',
      type: 'text' as const,
      placeholder: 'Ej: Crear',
    },
    {
      id: 'descripcion',
      label: 'Descripción',
      type: 'text' as const,
      placeholder: 'Ej: Permiso para crear elementos',
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

export default PermisosAdvancedFilters;
