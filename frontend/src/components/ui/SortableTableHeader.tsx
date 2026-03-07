import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortableTableHeaderProps {
  label: string;
  sortField: string;
  currentSort: string;
  onSort: (field: string) => void;
  className?: string;
}

export const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  label,
  sortField,
  currentSort,
  onSort,
  className = '',
}) => {
  const isActive = currentSort.replace('-', '') === sortField;
  const isDesc = currentSort.startsWith('-');

  const handleClick = () => {
    if (isActive && !isDesc) {
      // Si está activo en ascendente, cambiar a descendente
      onSort(`-${sortField}`);
    } else {
      // Cambiar a ascendente
      onSort(sortField);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
        isActive ? 'text-blue-600 font-semibold' : ''
      } ${className}`}
    >
      {label}
      {isActive && (
        isDesc ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronUp size={16} />
        )
      )}
    </button>
  );
};

export default SortableTableHeader;
