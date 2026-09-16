import { CircleDollarSign, ClipboardList, Factory, PackageSearch, Users, UserRoundCog, TrendingUp } from "lucide-react";
import { useDashboard } from "../../../context/DashboardContext";

const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function DashboardMetrics() {
  const { data, selectedMonth, selectedYear, dateRange } = useDashboard();

  if (!data) {
    return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />)}</div>;
  }

  const currency = (amount: number | string | null | undefined) => `Bs ${Number(amount || 0).toLocaleString("es-BO", { maximumFractionDigits: 0 })}`;
  const periodLabel = dateRange.start && dateRange.end
    ? `${dateRange.start} - ${dateRange.end}`
    : selectedMonth !== null ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}` : `Año ${selectedYear}`;

  const metrics = [
    { label: "Clientes", value: String(data.metrics.customers.total), detail: "registrados", Icon: Users, tone: "blue" },
    { label: "Empleados", value: String(data.metrics.employees.total), detail: "registrados", Icon: UserRoundCog, tone: "violet" },
    { label: "Ventas del período", value: currency(data.metrics.ventasDelPeriodo ?? data.metrics.ventasDelMes), detail: periodLabel, Icon: CircleDollarSign, tone: "emerald" },
    { label: "Cotizaciones", value: String(data.metrics.cotizacionesPendientes), detail: "pendientes", Icon: ClipboardList, tone: "amber" },
    { label: "Producción", value: String(data.metrics.produccionesActivas), detail: "órdenes activas", Icon: Factory, tone: "indigo" },
    { label: "Stock bajo", value: String(data.metrics.stockBajo), detail: "alertas activas", Icon: PackageSearch, tone: data.metrics.stockBajo > 0 ? "rose" : "slate" },
  ];

  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    slate: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <section aria-label="Indicadores principales" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Indicadores principales</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Resumen del negocio para {periodLabel.toLowerCase()}</p>
        </div>
        <span className="hidden items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 sm:inline-flex"><TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Datos actualizados</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {metrics.map(({ label, value, detail, Icon, tone }) => (
          <article key={label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium leading-5 text-gray-500 dark:text-gray-400">{label}</span>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></span>
            </div>
            <p className="mt-3 truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white" title={value}>{value}</p>
            <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
