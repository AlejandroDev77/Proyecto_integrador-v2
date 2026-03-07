import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';

interface PagosFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const PagosAdvancedFilters: React.FC<PagosFiltersProps> = ({
  onFiltersChange,
}) => {

  const filterFields = [
    {
      id: 'cod_pag',
      label: 'Código de Pago',
      type: 'text' as const,
      placeholder: 'Ej: PAG-1',
    },
    {
      id: 'referencia_pag',
      label: 'Referencia de Pago',
      type: 'text' as const,
      placeholder: 'Ej: REF12345',
    },
    {
      id: 'fec_pag_exacta',
      label: 'Fecha Exacta',
      type: 'date' as const,
    },
    {
      id: 'fec_pag_desde',
      label: 'Fecha Desde',
      type: 'date' as const,
    },
    {
      id: 'fec_pag_hasta',
      label: 'Fecha Hasta',
      type: 'date' as const,
    },
    {
      id: 'monto_min',
      label: 'Monto Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 100',
    },
    {
      id: 'monto_max',
      label: 'Monto Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 5000',
    },
    {
      id: 'metodo_pago',
      label: 'Método de Pago',
      type: 'text' as const,
      placeholder: 'Ej: Efectivo',
    },
    {
      id: 'est_ven',
      label: 'Estado de Venta',
      type: 'select' as const,
      options: [
        { value: 'completado', label: 'Completado' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'cancelado', label: 'Cancelado' },
      ],
    },
    {
      id: 'total_ven_min',
      label: 'Total Venta Mínimo',
      type: 'number' as const,
      placeholder: 'Ej: 100',
    },
    {
      id: 'total_ven_max',
      label: 'Total Venta Máximo',
      type: 'number' as const,
      placeholder: 'Ej: 10000',
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

export default PagosAdvancedFilters;
