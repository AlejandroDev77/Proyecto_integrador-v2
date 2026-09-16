import { useDashboard } from "../../context/DashboardContext";
import DateFilters from "./DateFilters";
import { RefreshCw, CalendarDays, LayoutDashboard } from "lucide-react";

export type TabType = "resumen" | "ventas" | "produccion" | "inventario";

interface DashboardHeaderProps {
  activeTab: TabType;
  tabLabel: string;
  tabIcon: React.ReactNode;
}

export default function DashboardHeader({ activeTab, tabLabel, tabIcon }: DashboardHeaderProps) {
  const { refetch } = useDashboard();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-5 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
            {tabIcon}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700 dark:text-orange-300">
              Panel de gestión
            </p>
            <h1 className="mt-0.5 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {tabLabel}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm capitalize text-gray-500 dark:text-gray-400">
              <CalendarDays className="h-3.5 w-3.5" /> {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <DateFilters />
          <button
            onClick={() => refetch()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-500"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-5 py-3 text-xs text-gray-500 dark:text-gray-400 sm:px-6">
        <LayoutDashboard className="h-3.5 w-3.5 text-orange-600" />
        <span>Indicadores y actividad del negocio</span>
      </div>
    </div>
  );
}
