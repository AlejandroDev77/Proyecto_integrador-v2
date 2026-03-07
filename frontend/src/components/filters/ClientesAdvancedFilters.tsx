import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface ClientesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const ClientesAdvancedFilters: React.FC<ClientesFiltersProps> = ({
  onFiltersChange,
}) => {

  const filterFields = [
    {
      id: 'cod_cli',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: CLI-1',
    },
    {
      id: 'nom_cli',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Juan',
    },
    {
      id: 'ap_pat_cli',
      label: 'Apellido Paterno',
      type: 'text' as const,
      placeholder: 'Ej: Pérez',
    },
    {
      id: 'ap_mat_cli',
      label: 'Apellido Materno',
      type: 'text' as const,
      placeholder: 'Ej: García',
    },
    {
      id: 'ci_cli',
      label: 'Cédula de Identidad',
      type: 'text' as const,
      placeholder: 'Ej: 12345678',
    },
    {
      id: 'cel_cli',
      label: 'Teléfono',
      type: 'text' as const,
      placeholder: 'Ej: 70123456',
    },
    {
      id: 'dir_cli',
      label: 'Dirección',
      type: 'text' as const,
      placeholder: 'Ej: Calle Principal',
    },
    {
      id: 'fec_nac_cli_exact',
      label: 'Fecha Nacimiento Exacta',
      type: 'date' as const,
    },
    {
      id: 'fec_nac_cli_min',
      label: 'Fecha Nacimiento Desde',
      type: 'date' as const,
    },
    {
      id: 'fec_nac_cli_max',
      label: 'Fecha Nacimiento Hasta',
      type: 'date' as const,
    },
    {
      id: 'nom_usu',
      label: 'Usuario Asignado',
      type: 'text' as const,
      placeholder: 'Ej: Admin',
    },
    {
      id: 'est_cli',
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

export default ClientesAdvancedFilters;
