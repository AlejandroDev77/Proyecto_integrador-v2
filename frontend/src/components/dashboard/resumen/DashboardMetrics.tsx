import { BoxIconLine, GroupIcon } from "../../../icons";
import { useDashboard } from "../../../context/DashboardContext";
import { motion } from "framer-motion";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function EcommerceMetrics() {
  const { data, selectedMonth, dateRange, selectedYear } = useDashboard();

  if (!data) return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-32 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      ))}
    </div>
  );

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

  const ventasValue = metrics.ventasDelPeriodo ?? metrics.ventasDelMes ?? 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5"
    >
      {/* Clientes */}
      <motion.div variants={cardVariants} className="group relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100/80 rounded-2xl dark:bg-blue-500/20 shadow-inner">
            <GroupIcon className="text-blue-600 size-6 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="mt-5">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Clientes Activos
            </span>
            <h4 className="mt-1 font-black text-gray-900 text-3xl dark:text-white drop-shadow-sm">
              {metrics.customers.total}
            </h4>
          </div>
        </div>
      </motion.div>

      {/* Empleados */}
      <motion.div variants={cardVariants} className="group relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100/80 rounded-2xl dark:bg-indigo-500/20 shadow-inner">
            <BoxIconLine className="text-indigo-600 size-6 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="mt-5">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Empleados
            </span>
            <h4 className="mt-1 font-black text-gray-900 text-3xl dark:text-white drop-shadow-sm">
              {metrics.employees.total}
            </h4>
          </div>
        </div>
      </motion.div>

      {/* Ventas del Período */}
      <motion.div variants={cardVariants} className="group relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100/80 rounded-2xl dark:bg-green-500/20 shadow-inner">
            <svg className="text-green-600 size-6 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-5">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 truncate block" title={periodoLabel}>
              Ventas: {periodoLabel}
            </span>
            <h4 className="mt-1 font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 text-3xl dark:from-green-400 dark:to-emerald-300 drop-shadow-sm">
              {formatCurrency(ventasValue)}
            </h4>
          </div>
        </div>
      </motion.div>

      {/* Cotizaciones Pendientes */}
      <motion.div variants={cardVariants} className="group relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100/80 rounded-2xl dark:bg-yellow-500/20 shadow-inner">
            <svg className="text-yellow-600 size-6 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="mt-5">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Cotizaciones Pend.
            </span>
            <h4 className="mt-1 font-black text-gray-900 text-3xl dark:text-white drop-shadow-sm">
              {metrics.cotizacionesPendientes}
            </h4>
          </div>
        </div>
      </motion.div>

      {/* Producciones Activas */}
      <motion.div variants={cardVariants} className="group relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100/80 rounded-2xl dark:bg-purple-500/20 shadow-inner">
            <svg className="text-purple-600 size-6 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="mt-5">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
              Producciones Act.
            </span>
            <h4 className="mt-1 font-black text-gray-900 text-3xl dark:text-white drop-shadow-sm">
              {metrics.produccionesActivas}
            </h4>
          </div>
        </div>
      </motion.div>

      {/* Stock Bajo */}
      <motion.div variants={cardVariants} className="group relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-red-200/50 dark:border-red-500/20 shadow-lg shadow-red-500/5 hover:shadow-red-500/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100/80 rounded-2xl dark:bg-red-500/20 shadow-inner">
            <svg className="text-red-600 size-6 dark:text-red-400 group-hover:scale-110 transition-transform duration-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-5">
            <span className="text-xs font-semibold tracking-wider uppercase text-red-500 dark:text-red-400">
              Alertas Stock Bajo
            </span>
            <h4 className="mt-1 font-black text-red-600 text-3xl dark:text-red-400 drop-shadow-sm">
              {metrics.stockBajo}
            </h4>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
