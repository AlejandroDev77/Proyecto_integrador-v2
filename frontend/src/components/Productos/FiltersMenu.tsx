import {
  ChevronDown,
  Check,
  X,
  Filter,
  ArrowUpDown,
  DollarSign,
} from "lucide-react";

type Props = {
  showFilterMenu: string | null;
  setShowFilterMenu: (s: string | null) => void;
  activeFilters: Record<string, string[]>;
  setActiveFilters: (f: Record<string, string[]>) => void;
  categories: string[];
};

// Filtros simplificados basados en los datos reales de la BD
const FILTERS_CONFIG = {
  Ordenar: {
    icon: ArrowUpDown,
    options: [
      "Más recientes",
      "Precio: menor a mayor",
      "Precio: mayor a menor",
      "Alfabético: A-Z",
      "Alfabético: Z-A",
    ],
  },
  Precio: {
    icon: DollarSign,
    options: [
      "Menos de Bs. 500",
      "Bs. 500 - 1.000",
      "Bs. 1.000 - 2.000",
      "Bs. 2.000 - 5.000",
      "Más de Bs. 5.000",
    ],
  },
};

export default function FiltersMenu({
  showFilterMenu,
  setShowFilterMenu,
  activeFilters,
  setActiveFilters,
  categories,
}: Props) {
  // Añadir categorías dinámicamente
  const FILTERS = {
    ...FILTERS_CONFIG,
    Categoría: {
      icon: Filter,
      options: categories,
    },
  };

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-[#f3e7d7]">
      {/* Header */}
      <div className="flex items-center gap-2 pr-4 border-r border-[#e8dcc7]">
        <div className="relative p-2 bg-[#f3e7d7] rounded-xl">
          <Filter className="w-5 h-5 text-[#a67c52]" />
          {totalActiveFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#a67c52] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalActiveFilters}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-[#3a2f22]">
          Filtrar por
        </span>
      </div>

      {/* Filter buttons */}
      {Object.entries(FILTERS).map(([filterName, config]) => {
        const filterCount = activeFilters[filterName]?.length || 0;
        const isOpen = showFilterMenu === filterName;
        const Icon = config.icon;

        return (
          <div key={filterName} className="relative">
            <button
              onClick={() => setShowFilterMenu(isOpen ? null : filterName)}
              className={`
                group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${
                  isOpen
                    ? "bg-[#3a2f22] text-white shadow-lg"
                    : filterCount > 0
                    ? "bg-[#f3e7d7] text-[#7c5e3c] border-2 border-[#a67c52]"
                    : "bg-[#faf8f5] text-[#7c5e3c] hover:bg-[#f3e7d7] border-2 border-transparent"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{filterName}</span>
              {filterCount > 0 && (
                <span
                  className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${isOpen ? "bg-white/20" : "bg-[#a67c52] text-white"}
                `}
                >
                  {filterCount}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#e8dcc7] min-w-[240px] max-h-[320px] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#f3e7d7] bg-[#faf8f5]">
                  <p className="text-sm font-bold text-[#3a2f22]">
                    {filterName}
                  </p>
                </div>
                <div className="p-2 max-h-[260px] overflow-y-auto">
                  {config.options.map((option) => {
                    const isSelected =
                      activeFilters[filterName]?.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          const current = activeFilters[filterName] || [];
                          const updated = isSelected
                            ? current.filter((o) => o !== option)
                            : [...current, option];
                          setActiveFilters({
                            ...activeFilters,
                            [filterName]: updated,
                          });
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                          transition-all duration-150
                          ${
                            isSelected
                              ? "bg-[#f3e7d7] text-[#a67c52] font-medium"
                              : "text-gray-600 hover:bg-[#faf8f5]"
                          }
                        `}
                      >
                        <span
                          className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center
                          transition-all
                          ${
                            isSelected
                              ? "bg-[#a67c52] border-[#a67c52]"
                              : "border-gray-300"
                          }
                        `}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </span>
                        <span className="flex-1 text-left">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Clear button */}
      {totalActiveFilters > 0 && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
          Limpiar todo
        </button>
      )}
    </div>
  );
}
