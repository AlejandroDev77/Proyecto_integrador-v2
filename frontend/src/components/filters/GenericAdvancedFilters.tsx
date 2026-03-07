import React from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';
import { ArrowUpDown } from 'lucide-react';

interface GenericFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  onSortChange: (sort: string) => void;
  filterFields: Array<{
    id: string;
    label: string;
    type: 'text' | 'select' | 'range' | 'number' | 'date';
    placeholder?: string;
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
    step?: number;
  }>;
  sortOptions: Array<{
    label: string;
    value: string;
  }>;
}

export const GenericAdvancedFilters: React.FC<GenericFiltersProps> = ({
  onFiltersChange,
  onSortChange,
  filterFields,
  sortOptions,
}) => {
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

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Ordenar por:
        </span>
        <div className="flex gap-2 flex-wrap">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition-colors"
            >
              <ArrowUpDown size={16} />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenericAdvancedFilters;
