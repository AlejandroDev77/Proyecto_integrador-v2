import { useDashboard } from "../../context/DashboardContext";

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

  if (totalAlertas === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
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
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Alertas de Inventario
        </h3>
        <span className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400 rounded-full">
          {totalAlertas} alertas
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {alertasMateriales.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Materiales
            </p>
            {alertasMateriales.map((item, idx) => (
              <div
                key={`mat-${idx}`}
                className={`flex items-center justify-between p-3 rounded-xl border mb-2 ${getUrgencyBg(
                  item.stock,
                  item.stock_min
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-8 rounded-full ${getUrgencyColor(
                      item.stock,
                      item.stock_min
                    )}`}
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white/90 text-sm">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mínimo: {item.stock_min} {item.unidad_medida}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800 dark:text-white/90">
                    {item.stock}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.unidad_medida}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {alertasMuebles.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Muebles
            </p>
            {alertasMuebles.map((item, idx) => (
              <div
                key={`mue-${idx}`}
                className={`flex items-center justify-between p-3 rounded-xl border mb-2 ${getUrgencyBg(
                  item.stock,
                  item.stock_min
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-8 rounded-full ${getUrgencyColor(
                      item.stock,
                      item.stock_min
                    )}`}
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white/90 text-sm">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mínimo: {item.stock_min} unidades
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800 dark:text-white/90">
                    {item.stock}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    unidades
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
