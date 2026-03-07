import { BoxIconLine, GroupIcon } from "../../icons";
import { useDashboard } from "../../context/DashboardContext";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function EcommerceMetrics() {
  const { data, selectedMonth, dateRange, selectedYear } = useDashboard();

  if (!data) return <div>Cargando...</div>;

  const metrics = data.metrics;

  const formatCurrency = (value: number | string | null | undefined) => {
    const numValue = Number(value) || 0;
    return `Bs ${numValue.toLocaleString("es-BO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Determine period label
  let periodoLabel = "Ventas del Período";
  if (dateRange.start && dateRange.end) {
    periodoLabel = `${dateRange.start} a ${dateRange.end}`;
  } else if (selectedMonth !== null) {
    periodoLabel = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  } else {
    periodoLabel = `Año ${selectedYear}`;
  }

  // Use ventasDelPeriodo if available, otherwise use ventasDelMes
  const ventasValue = metrics.ventasDelPeriodo ?? metrics.ventasDelMes ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
      {/* Clientes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl dark:bg-blue-500/20">
          <GroupIcon className="text-blue-600 size-5 dark:text-blue-400" />
        </div>
        <div className="mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Clientes Activos
          </span>
          <h4 className="mt-1 font-bold text-gray-800 text-xl dark:text-white/90">
            {metrics.customers.total}
          </h4>
        </div>
      </div>

      {/* Empleados */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl dark:bg-indigo-500/20">
          <BoxIconLine className="text-indigo-600 size-5 dark:text-indigo-400" />
        </div>
        <div className="mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Empleados
          </span>
          <h4 className="mt-1 font-bold text-gray-800 text-xl dark:text-white/90">
            {metrics.employees.total}
          </h4>
        </div>
      </div>

      {/* Ventas del Período */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl dark:bg-green-500/20">
          <svg
            className="text-green-600 size-5 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="mt-4">
          <span
            className="text-xs text-gray-500 dark:text-gray-400"
            title={periodoLabel}
          >
            Ventas: {periodoLabel}
          </span>
          <h4 className="mt-1 font-bold text-green-600 text-lg dark:text-green-400">
            {formatCurrency(ventasValue)}
          </h4>
        </div>
      </div>

      {/* Cotizaciones Pendientes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-xl dark:bg-yellow-500/20">
          <svg
            className="text-yellow-600 size-5 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Cotizaciones Pendientes
          </span>
          <h4 className="mt-1 font-bold text-gray-800 text-xl dark:text-white/90">
            {metrics.cotizacionesPendientes}
          </h4>
        </div>
      </div>

      {/* Producciones Activas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl dark:bg-purple-500/20">
          <svg
            className="text-purple-600 size-5 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <div className="mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Producciones Activas
          </span>
          <h4 className="mt-1 font-bold text-gray-800 text-xl dark:text-white/90">
            {metrics.produccionesActivas}
          </h4>
        </div>
      </div>

      {/* Stock Bajo */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl dark:bg-red-500/20">
          <svg
            className="text-red-600 size-5 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Alertas Stock Bajo
          </span>
          <h4 className="mt-1 font-bold text-gray-800 text-xl dark:text-white/90">
            {metrics.stockBajo}
          </h4>
        </div>
      </div>
    </div>
  );
}
