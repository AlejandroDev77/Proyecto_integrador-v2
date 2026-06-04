import { useDashboard } from "../../context/DashboardContext";
import DateFilters from "./DateFilters";

export type TabType = "resumen" | "ventas" | "produccion" | "inventario";

interface DashboardHeaderProps {
  activeTab: TabType;
  tabLabel: string;
  tabIcon: React.ReactNode;
}

export default function DashboardHeader({ activeTab, tabLabel, tabIcon }: DashboardHeaderProps) {
  const { refetch } = useDashboard();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-linear-to-r from-orange-600 via-orange-700 to-orange-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 rounded-2xl p-6 mb-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl text-white">
            {tabIcon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Dashboard - {tabLabel}
            </h1>
            <p className="text-blue-100 dark:text-gray-400 text-sm capitalize">
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
          <DateFilters />
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-all"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
