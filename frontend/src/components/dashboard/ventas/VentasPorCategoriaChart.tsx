import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useDashboard } from "../../../context/DashboardContext";

export default function VentasPorCategoriaChart() {
  const { data, selectedYear } = useDashboard();
  const [series, setSeries] = useState([
    { name: "Ventas", data: [] as number[] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalVentas, setTotalVentas] = useState(0);

  useEffect(() => {
    if (data?.ventas_por_categoria && data.ventas_por_categoria.length > 0) {
      // Parse numbers properly
      const valores = data.ventas_por_categoria.map(
        (c) => Number(c.total) || 0
      );
      const nombres = data.ventas_por_categoria.map((c) =>
        c.categoria.length > 15
          ? c.categoria.substring(0, 13) + "..."
          : c.categoria
      );
      setSeries([{ name: "Ventas (Bs)", data: valores }]);
      setCategories(nombres);
      setTotalVentas(valores.reduce((a, b) => a + b, 0));
    }
  }, [data]);

  // Force redraw
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const options: ApexOptions = {
    colors: [
      "#3b82f6",
      "#22c55e",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
    ],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 320,
      toolbar: { show: false },
      redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "70%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `Bs ${val.toLocaleString()}`,
      style: {
        fontSize: "11px",
        fontWeight: 600,
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val: string) => {
          const num = Number(val);
          if (num >= 1000) {
            return `Bs ${(num / 1000).toFixed(1)}k`;
          }
          return `Bs ${num}`;
        },
        style: { colors: "#6b7280", fontSize: "11px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#374151", fontSize: "12px", fontWeight: 500 },
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val: number) => `Bs ${val.toLocaleString()}`,
      },
    },
  };

  if (!data?.ventas_por_categoria || data.ventas_por_categoria.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <svg
          className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Sin ventas por categoría
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          en {selectedYear}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-3 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Ventas por Categoría
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.ventas_por_categoria.length} categorías en {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total:
          </span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            Bs {totalVentas.toLocaleString()}
          </span>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
