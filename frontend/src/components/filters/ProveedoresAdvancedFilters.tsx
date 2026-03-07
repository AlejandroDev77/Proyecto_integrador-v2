import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface ProveedoresFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const ProveedoresAdvancedFilters: React.FC<ProveedoresFiltersProps> = ({
  onFiltersChange,
}) => {
  const filterFields = [
    {
      id: 'cod_prov',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: PROV-1',
    },
    {
      id: 'nom_prov',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Proveedora XYZ',
    },
    {
      id: 'contacto_prov',
      label: 'Contacto',
      type: 'text' as const,
      placeholder: 'Ej: Juan García',
    },
    {
      id: 'tel_prov',
      label: 'Teléfono',
      type: 'text' as const,
      placeholder: 'Ej: 70123456',
    },
    {
      id: 'email_prov',
      label: 'Email',
      type: 'text' as const,
      placeholder: 'Ej: contacto@prov.com',
    },
    {
      id: 'dir_prov',
      label: 'Dirección',
      type: 'text' as const,
      placeholder: 'Ej: Calle Principal 123',
    },
    {
      id: 'nit_prov',
      label: 'NIT',
      type: 'text' as const,
      placeholder: 'Ej: 12345678',
    },
    {
      id: 'est_prov',
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

export default ProveedoresAdvancedFilters;
