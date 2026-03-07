import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, RotateCcw, Filter, Check, Calendar } from "lucide-react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";

interface FilterField {
  id: string;
  label: string;
  type: "text" | "select" | "range" | "number" | "date";
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

interface AdvancedFiltersProps {
  fields: FilterField[];
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset?: () => void;
}

// DatePicker Field Component using flatpickr (TailAdmin style)
interface DatePickerFieldProps {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  id,
  value,
  placeholder,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickrInstance.current = flatpickr(inputRef.current, {
        mode: "single",
        static: true,
        monthSelectorType: "static",
        dateFormat: "Y-m-d",
        defaultDate: value || undefined,
        locale: Spanish,
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const formattedDate = selectedDates[0].toISOString().split("T")[0];
            onChange(formattedDate);
          } else {
            onChange("");
          }
        },
      });
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  // Update flatpickr when value changes externally
  useEffect(() => {
    if (flatpickrInstance.current && value !== undefined) {
      flatpickrInstance.current.setDate(value || "", false);
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white/90 dark:placeholder:text-white/30 bg-white text-gray-800 border-gray-300 focus:border-teal-300 focus:ring-teal-500/20 dark:border-gray-600 dark:focus:border-teal-800"
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <Calendar className="size-5" />
      </span>
    </div>
  );
};

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  fields,
  onFiltersChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (fieldId: string, value: any, index?: number) => {
    // Use index as fallback if fieldId is empty
    const key = fieldId || `field-${index}`;
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({});
    setAppliedFilters({});
    onReset?.();
    onFiltersChange({});
  };

  const handleRangeChange = (
    fieldId: string,
    minOrMax: "min" | "max",
    value: string,
    index?: number
  ) => {
    // Use index as fallback if fieldId is empty
    const key = fieldId || `field-${index}`;
    const currentRange = filters[key] || {};
    const newRange = {
      ...currentRange,
      [minOrMax]: value ? Number(value) : undefined,
    };
    const newFilters = { ...filters, [key]: newRange };
    setFilters(newFilters);
  };

  const activeFiltersCount = Object.keys(appliedFilters).filter(
    (key) =>
      appliedFilters[key] !== undefined &&
      appliedFilters[key] !== "" &&
      appliedFilters[key] !== null
  ).length;

  const pendingChanges =
    JSON.stringify(filters) !== JSON.stringify(appliedFilters);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
        >
          <Filter size={18} />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-white text-teal-600 rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            <RotateCcw size={18} />
            Limpiar
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field, index) => (
              <div key={field.id || `field-${index}`}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder || field.label}
                    value={filters[field.id || `field-${index}`] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.id, e.target.value, index)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    placeholder={field.placeholder || field.label}
                    value={filters[field.id || `field-${index}`] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.id, e.target.value, index)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {field.type === "date" && (
                  <DatePickerField
                    id={`filter-date-${field.id || index}`}
                    value={filters[field.id || `field-${index}`] || ""}
                    placeholder={field.placeholder || "Seleccionar fecha"}
                    onChange={(value) =>
                      handleFilterChange(field.id, value, index)
                    }
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={filters[field.id || `field-${index}`] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.id, e.target.value, index)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "range" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        value={filters[field.id || `field-${index}`]?.min || ""}
                        onChange={(e) =>
                          handleRangeChange(
                            field.id,
                            "min",
                            e.target.value,
                            index
                          )
                        }
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        value={filters[field.id || `field-${index}`]?.max || ""}
                        onChange={(e) =>
                          handleRangeChange(
                            field.id,
                            "max",
                            e.target.value,
                            index
                          )
                        }
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2 justify-end flex-wrap">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilters}
              disabled={!pendingChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                pendingChanges
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              <Check size={18} />
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
