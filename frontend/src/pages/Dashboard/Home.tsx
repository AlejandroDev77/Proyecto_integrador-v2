import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  DashboardProvider,
  useDashboard,
} from "../../context/DashboardContext";
import DashboardHeader, {
  TabType,
} from "../../components/dashboard/DashboardHeader";
import ResumenTab from "../../components/dashboard/tabs/ResumenTab";
import VentasTab from "../../components/dashboard/tabs/VentasTab";
import ProduccionTab from "../../components/dashboard/tabs/ProduccionTab";
import InventarioTab from "../../components/dashboard/tabs/InventarioTab";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: "resumen",
    label: "Resumen",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    id: "ventas",
    label: "Ventas",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  {
    id: "produccion",
    label: "Producción",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  {
    id: "inventario",
    label: "Inventario",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
];

// Main dashboard content
function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabType>("resumen");
  const { loading, error } = useDashboard();

  // Force resize on tab change to fix chart rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-500/30">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
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
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <DashboardHeader
        activeTab={activeTab}
        tabLabel={currentTab?.label || ""}
        tabIcon={currentTab?.icon}
      />

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/50"
            }`}
          >
            <span
              className={
                activeTab === tab.id
                  ? "text-orange-600 dark:text-orange-400"
                  : ""
              }
            >
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Cargando datos...
            </span>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="min-h-[calc(100vh-350px)]">
        {activeTab === "resumen" && <ResumenTab key="resumen" />}
        {activeTab === "ventas" && <VentasTab key="ventas" />}
        {activeTab === "produccion" && <ProduccionTab key="produccion" />}
        {activeTab === "inventario" && <InventarioTab key="inventario" />}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Sistema de Gestión de Mueblería"
        description="Panel de control con métricas de ventas, producción e inventario"
      />
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
