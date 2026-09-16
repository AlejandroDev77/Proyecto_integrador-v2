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
        className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
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
      className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Alertas de Inventario
        </h3>
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {totalAlertas} alertas
        </span>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-h-80 space-y-3 overflow-y-auto pr-2 custom-scrollbar"
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
                className={`group mb-2 flex cursor-default items-center justify-between rounded-lg border p-3 transition-colors ${getUrgencyBg(
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
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.nombre}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Mínimo: {item.stock_min} {item.unidad_medida}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
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
                className={`group mb-2 flex cursor-default items-center justify-between rounded-lg border p-3 transition-colors ${getUrgencyBg(
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
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.nombre}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Mínimo: {item.stock_min} unidades
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
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
