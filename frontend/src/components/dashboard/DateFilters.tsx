import { useRef, useEffect } from "react";
import flatpickr from "flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.css";
import { useDashboard } from "../../context/DashboardContext";
import { CalendarDays, X } from "lucide-react";

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
        // Se monta en body para que el calendario no quede recortado por el encabezado.
        static: false,
        appendTo: document.body,
        position: "below",
        onReady: (_, __, instance) => {
          instance.calendarContainer.classList.add("dashboard-range-calendar");
        },
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
    <div className="flex flex-wrap items-center gap-2">
      {/* Year Selector */}
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-800">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Año</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          disabled={loading}
          className="cursor-pointer bg-transparent py-2 text-sm font-semibold text-gray-800 outline-none dark:text-white disabled:opacity-50"
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-gray-900">
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-800">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Mes</label>
        <select
          value={selectedMonth ?? ""}
          onChange={(e) =>
            setSelectedMonth(e.target.value ? Number(e.target.value) : null)
          }
          disabled={loading || Boolean(isUsingDateRange)}
          className="cursor-pointer bg-transparent py-2 text-sm font-semibold text-gray-800 outline-none dark:text-white disabled:opacity-50"
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
      <span className="mx-1 hidden h-6 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

      {/* Date Range with Flatpickr */}
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-800">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Rango</label>
        <div className="relative flex items-center">
          <CalendarDays className="pointer-events-none absolute left-0 h-4 w-4 text-gray-400" />
          <input
            ref={dateRangeRef}
            type="text"
            placeholder="Seleccionar fechas"
            disabled={loading}
            className="w-36 cursor-pointer bg-transparent py-2 pl-6 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 dark:text-white disabled:opacity-50 sm:w-40"
          />
        </div>
        {isUsingDateRange && (
          <button
            onClick={clearDateRange}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
            title="Limpiar rango"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
      )}
    </div>
  );
}
