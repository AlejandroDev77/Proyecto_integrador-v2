import { useDashboard } from "../../../context/DashboardContext";
import { motion } from "framer-motion";

export default function AlertasInventario() {
  const { data } = useDashboard();

  const alertasMateriales = data?.alertas_stock?.materiales || [];
  const alertasMuebles = data?.alertas_stock?.muebles || [];
  const totalAlertas = alertasMateriales.length + alertasMuebles.length;

  const getUrgencyColor = (stock: number, stockMin: number) => {
    const ratio = stock / stockMin;
    if (ratio <= 0.25) return "bg-red-500";
    if (ratio <= 0.5) return "bg-orange-500";
    if (ratio <= 0.75) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getUrgencyBg = (stock: number, stockMin: number) => {
    const ratio = stock / stockMin;
    if (ratio <= 0.25)
      return "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30";
    if (ratio <= 0.5)
      return "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30";
    if (ratio <= 0.75)
      return "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30";
    return "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (totalAlertas === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg sm:p-6 h-full flex flex-col"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full mix-blend-multiply filter blur-[60px] -mr-10 -mt-10 pointer-events-none" />
        <h3 className="relative z-10 text-xl font-black text-gray-900 dark:text-white drop-shadow-sm mb-4">
          Alertas de Inventario
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-green-600 dark:text-green-400 font-medium">
            Todo el inventario está en orden
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            No hay productos con stock bajo
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-[2rem] bg-white/60 p-5 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-lg sm:p-6 h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full mix-blend-multiply filter blur-[60px] -mr-10 -mt-10 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-gray-900 dark:text-white drop-shadow-sm">
          Alertas de Inventario
        </h3>
        <span className="px-3 py-1 text-xs font-black uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400 rounded-full animate-pulse">
          {totalAlertas} alertas
        </span>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2"
      >
        {alertasMateriales.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Materiales
            </p>
            {alertasMateriales.map((item, idx) => (
              <motion.div
                variants={itemVariants}
                key={`mat-${idx}`}
                className={`group flex items-center justify-between p-3 rounded-xl border mb-2 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default ${getUrgencyBg(
                  item.stock,
                  item.stock_min
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-8 rounded-full shadow-inner ${getUrgencyColor(
                      item.stock,
                      item.stock_min
                    )}`}
                  />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white/90 text-sm group-hover:text-[#a67c52] transition-colors">
                      {item.nombre}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Mínimo: {item.stock_min} {item.unidad_medida}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-gray-800 dark:text-white/90 group-hover:scale-110 transition-transform origin-right">
                    {item.stock}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {item.unidad_medida}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {alertasMuebles.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Muebles
            </p>
            {alertasMuebles.map((item, idx) => (
              <motion.div
                variants={itemVariants}
                key={`mue-${idx}`}
                className={`group flex items-center justify-between p-3 rounded-xl border mb-2 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default ${getUrgencyBg(
                  item.stock,
                  item.stock_min
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-8 rounded-full shadow-inner ${getUrgencyColor(
                      item.stock,
                      item.stock_min
                    )}`}
                  />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white/90 text-sm group-hover:text-[#a67c52] transition-colors">
                      {item.nombre}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Mínimo: {item.stock_min} unidades
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-gray-800 dark:text-white/90 group-hover:scale-110 transition-transform origin-right">
                    {item.stock}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    unidades
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
