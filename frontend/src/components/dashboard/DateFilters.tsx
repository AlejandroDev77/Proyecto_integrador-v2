import { useRef, useEffect } from "react";
import flatpickr from "flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.css";
import { useDashboard } from "../../context/DashboardContext";

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export default function DateFilters() {
  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    dateRange,
    setDateRange,
    loading,
  } = useDashboard();

  const dateRangeRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const clearDateRange = () => {
    setDateRange(null, null);
    if (flatpickrInstance.current) {
      flatpickrInstance.current.clear();
    }
  };

  const isUsingDateRange = dateRange.start && dateRange.end;

  // Initialize flatpickr
  useEffect(() => {
    if (dateRangeRef.current && !flatpickrInstance.current) {
      flatpickrInstance.current = flatpickr(dateRangeRef.current, {
        mode: "range",
        locale: Spanish,
        dateFormat: "Y-m-d",
        allowInput: false,
        static: true,
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            const formatDate = (d: Date) => {
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            };
            setDateRange(
              formatDate(selectedDates[0]),
              formatDate(selectedDates[1])
            );
          }
        },
      });
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }
    };
  }, [setDateRange]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Year Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-white/70">Año:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          disabled={loading}
          className="appearance-none bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer disabled:opacity-50"
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-gray-900">
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-white/70">Mes:</label>
        <select
          value={selectedMonth ?? ""}
          onChange={(e) =>
            setSelectedMonth(e.target.value ? Number(e.target.value) : null)
          }
          disabled={loading || Boolean(isUsingDateRange)}
          className="appearance-none bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer disabled:opacity-50"
        >
          <option value="" className="text-gray-900">
            Todo el año
          </option>
          {MONTHS.map((month) => (
            <option
              key={month.value}
              value={month.value}
              className="text-gray-900"
            >
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-white/20 hidden sm:block" />

      {/* Date Range with Flatpickr */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-white/70">Rango:</label>
        <div className="relative">
          <input
            ref={dateRangeRef}
            type="text"
            placeholder="Seleccionar fechas"
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 w-48 placeholder:text-white/50"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
        </div>
        {isUsingDateRange && (
          <button
            onClick={clearDateRange}
            className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-white/80 transition-all"
            title="Limpiar rango"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
