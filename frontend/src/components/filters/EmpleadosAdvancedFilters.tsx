import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface EmpleadosFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const EmpleadosAdvancedFilters: React.FC<EmpleadosFiltersProps> = ({
  onFiltersChange,
}) => {

  const filterFields = [
    {
      id: 'cod_emp',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: EMP-1',
    },
    {
      id: 'nom_emp',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Carlos',
    },
    {
      id: 'ap_pat_emp',
      label: 'Apellido Paterno',
      type: 'text' as const,
      placeholder: 'Ej: López',
    },
    {
      id: 'ap_mat_emp',
      label: 'Apellido Materno',
      type: 'text' as const,
      placeholder: 'Ej: Rodríguez',
    },
    {
      id: 'ci_emp',
      label: 'Cédula de Identidad',
      type: 'text' as const,
      placeholder: 'Ej: 87654321',
    },
    {
      id: 'cel_emp',
      label: 'Teléfono',
      type: 'text' as const,
      placeholder: 'Ej: 70987654',
    },
    {
      id: 'car_emp',
      label: 'Cargo',
      type: 'text' as const,
      placeholder: 'Ej: Carpintero',
    },
    {
      id: 'nom_usu',
      label: 'Usuario Asignado',
      type: 'text' as const,
      placeholder: 'Ej: Admin',
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

export default EmpleadosAdvancedFilters;
