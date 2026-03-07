import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface CotizacionesFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const CotizacionesAdvancedFilters: React.FC<CotizacionesFiltersProps> = ({
  onFiltersChange,
}) => {
  const filterFields = [
    {
      id: 'cod_cot',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: COT-1',
    },
    {
      id: 'nom_cli',
      label: 'Nombre Cliente',
      type: 'text' as const,
      placeholder: 'Ej: Juan Pérez',
    },
    {
      id: 'nom_emp',
      label: 'Nombre empleado',
      type: 'text' as const,
      placeholder: 'Ej: María Gómez',
    },
    
    {
      id: 'fec_cot_exacta',
      label: 'Fecha Exacta',
      type: 'date' as const,
    },
    {
      id: 'fec_cot_desde',
      label: 'Fecha Desde',
      type: 'date' as const,
    },
    {
      id: 'fec_cot_hasta',
      label: 'Fecha Hasta',
      type: 'date' as const,
    },
    {
      id: 'validez_dias_min',
      label: 'Validez Mínima (días)',
      type: 'number' as const,
    },
    {
      id: 'validez_dias_max',
      label: 'Validez Máxima (días)',
      type: 'number' as const,

    },
    
    {
      id: 'total_cot_min',
      label: 'Monto Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 1000',
    },
    {
      id: 'total_cot_max',
      label: 'Monto Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 100000',
    },
    {
      id: 'descuento_min',
      label: 'Descuento Mínimo',
      type: 'number' as const,  
      placeholder: 'Ej: 0',
    },
    {
      id: 'descuento_max',
      label: 'Descuento Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 5000',

    },
    {
      id: 'est_cot',
      label: 'Estado',
      type: 'select' as const,
      options: [
        { value: 'aceptada', label: 'Aceptada' },
        { value: 'rechazada', label: 'Rechazada' },
        { value: 'pendiente', label: 'Pendiente' },
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

export default CotizacionesAdvancedFilters;
