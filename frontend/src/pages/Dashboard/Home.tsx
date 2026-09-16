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
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ChartNoAxesCombined, Factory, Boxes } from "lucide-react";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "resumen", label: "Resumen", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "ventas", label: "Ventas", icon: <ChartNoAxesCombined className="h-4 w-4" /> },
  { id: "produccion", label: "Producción", icon: <Factory className="h-4 w-4" /> },
  { id: "inventario", label: "Inventario", icon: <Boxes className="h-4 w-4" /> },
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

      {/* Tab Navigation with Framer Motion */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-800 dark:bg-gray-900 relative z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 z-10 ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-dashboard-tab"
                className="absolute inset-0 bg-gray-900 dark:bg-gray-700 rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {tab.icon}
            </span>
            <span className="hidden sm:inline relative z-10">{tab.label}</span>
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

      {/* Tab Content with AnimatePresence */}
      <div className="min-h-[calc(100vh-350px)] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "resumen" && <ResumenTab />}
            {activeTab === "ventas" && <VentasTab />}
            {activeTab === "produccion" && <ProduccionTab />}
            {activeTab === "inventario" && <InventarioTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <PageMeta
          title="Dashboard | Sistema de Gestión de Mueblería"
          description="Panel de control con métricas de ventas, producción e inventario"
        />
        <DashboardProvider>
          <DashboardContent />
        </DashboardProvider>
      </div>
    </div>
  );
}
