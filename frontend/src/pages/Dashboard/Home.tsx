import { useState, useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.css";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import VentasVsComprasChart from "../../components/ecommerce/VentasVsComprasChart";
import VentasPorCategoriaChart from "../../components/ecommerce/VentasPorCategoriaChart";
import EstadoProduccionesChart from "../../components/ecommerce/EstadoProduccionesChart";
import TopMueblesChart from "../../components/ecommerce/TopMueblesChart";
import AlertasInventario from "../../components/ecommerce/AlertasInventario";
import ConversionCotizacionesChart from "../../components/ecommerce/ConversionCotizacionesChart";
import ProduccionesMensualesChart from "../../components/ecommerce/ProduccionesMensualesChart";
import ComprasPorProveedorChart from "../../components/ecommerce/ComprasPorProveedorChart";
import StockMueblesChart from "../../components/ecommerce/StockMueblesChart";
import VentasCantidadChart from "../../components/ecommerce/VentasCantidadChart";
import PageMeta from "../../components/common/PageMeta";
import {
  DashboardProvider,
  useDashboard,
} from "../../context/DashboardContext";

type TabType = "resumen" | "ventas" | "produccion" | "inventario";

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

// Date Filters component
function DateFilters() {
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

// Dashboard header component
function DashboardHeader({ activeTab }: { activeTab: TabType }) {
  const { refetch } = useDashboard();
  const tabInfo = tabs.find((t) => t.id === activeTab);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 rounded-2xl p-6 mb-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl text-white">
            {tabInfo?.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Dashboard - {tabInfo?.label}
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

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <DashboardHeader activeTab={activeTab} />

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/50"
            }`}
          >
            <span
              className={
                activeTab === tab.id ? "text-blue-600 dark:text-blue-400" : ""
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
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Cargando datos...
            </span>
          </div>
        </div>
      )}

      {/* Tab Content - Unique charts per tab, no duplicates */}
      <div className="min-h-[calc(100vh-350px)]">
        {/* RESUMEN Tab - Overview metrics and key indicators */}
        {activeTab === "resumen" && (
          <div key="resumen" className="space-y-6 animate-fadeIn">
            <EcommerceMetrics />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-8">
                <StatisticsChart />
              </div>
              <div className="col-span-12 xl:col-span-4">
                <MonthlyTarget />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6">
                <ConversionCotizacionesChart />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <AlertasInventario />
              </div>
            </div>
          </div>
        )}

        {/* VENTAS Tab - Sales-focused charts */}
        {activeTab === "ventas" && (
          <div key="ventas" className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-7">
                <VentasVsComprasChart />
              </div>
              <div className="col-span-12 xl:col-span-5">
                <VentasPorCategoriaChart />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7">
                <VentasCantidadChart />
              </div>
              <div className="col-span-12 lg:col-span-5">
                <TopMueblesChart />
              </div>
            </div>
            <MonthlySalesChart />
          </div>
        )}

        {/* PRODUCCIÓN Tab - Production-focused charts */}
        {activeTab === "produccion" && (
          <div key="produccion" className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-5">
                <EstadoProduccionesChart />
              </div>
              <div className="col-span-12 lg:col-span-7">
                <ProduccionesMensualesChart />
              </div>
            </div>
          </div>
        )}

        {/* INVENTARIO Tab - Inventory-focused charts */}
        {activeTab === "inventario" && (
          <div key="inventario" className="space-y-6 animate-fadeIn">
            <AlertasInventario />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7">
                <StockMueblesChart />
              </div>
              <div className="col-span-12 lg:col-span-5">
                <ComprasPorProveedorChart />
              </div>
            </div>
          </div>
        )}
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
