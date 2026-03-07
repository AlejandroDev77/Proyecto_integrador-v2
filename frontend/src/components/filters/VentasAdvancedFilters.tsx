import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface VentasFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const VentasAdvancedFilters: React.FC<VentasFiltersProps> = ({
  onFiltersChange,
}) => {
  const filterFields = [
    {
      id: 'cod_ven',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: VEN-1',
    },
    {
      id: 'fec_ven_exacta',
      label: 'Fecha Exacta',
      type: 'date' as const,
    },
    {
      id: 'fec_ven_desde',
      label: 'Fecha Desde',
      type: 'date' as const,
    },
    {
      id: 'fec_ven_hasta',
      label: 'Fecha Hasta',
      type: 'date' as const,
    },
    {
      id: 'total_ven_min',
      label: 'Monto Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 1000',
    },
    {
      id: 'total_ven_max',
      label: 'Monto Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 100000',
    },
    {
      id: 'est_ven',
      label: 'Estado',
      type: 'select' as const,
      options: [
        { value: 'completada', label: 'Completada' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'cancelada', label: 'Cancelada' },
      ],
    },
    {
      id: 'nom_cli',
      label: 'Nombre del Cliente',
      type: 'text' as const,
      placeholder: 'Ej: Juan',
    },
    {
      id: 'nom_emp',
      label: 'Nombre del Empleado',
      type: 'text' as const,
      placeholder: 'Ej: María', 
    },
    {
      id: 'ci_cli',
      label: 'C.I. del Cliente',
      type: 'text' as const,
      placeholder: 'Ej: 12345678',
    }
    
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

export default VentasAdvancedFilters;
