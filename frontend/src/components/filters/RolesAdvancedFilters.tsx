import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface RolesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const RolesAdvancedFilters: React.FC<RolesFiltersProps> = ({
  onFiltersChange,
}) => {

  const filterFields = [
    {
      id: 'nom_rol',
      label: 'Nombre del Rol',
      type: 'text' as const,
      placeholder: 'Ej: Administrador',
    },
    {
      id: 'nom_per',
      label: 'Permisos',
      type: 'text' as const,
      placeholder: 'Ej: Editar, Ver',
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

export default RolesAdvancedFilters;