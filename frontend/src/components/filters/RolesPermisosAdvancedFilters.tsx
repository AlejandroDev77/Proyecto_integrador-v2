import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface RolesPermisosFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const RolesPermisosAdvancedFilters: React.FC<RolesPermisosFiltersProps> = ({
  onFiltersChange,
}) => {

  const filterFields = [
    {
      id: 'nom_rol',
      label: 'Rol',
      type: 'text' as const,
      placeholder: 'Ej: Administrador',
    },
    {
      id: 'nom_per',
      label: 'Permiso',
      type: 'text' as const,
      placeholder: 'Ej: Crear',
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

export default RolesPermisosAdvancedFilters;
